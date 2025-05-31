// src/utils/contactHelper.ts
import { PrismaClient, Contact } from "@prisma/client";

type Input = {
  email?: string;
  phoneNumber?: string;
};

export const reconcileIdentity = async (
  { email, phoneNumber }: Input,
  prisma: PrismaClient
) => {
  // 1. Find all matching contacts
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  let allContacts = [...contacts];
  let primaryContact: Contact | null = null;

  // 2. Determine primary contact
  if (contacts.length > 0) {
    const primary = contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];
    const primaryId = primary.linkedId || primary.id;
    primaryContact = await prisma.contact.findUnique({ where: { id: primaryId } });

    // 3. Fetch all related secondaries
    const secondaries = await prisma.contact.findMany({
      where: {
        OR: [
          { linkedId: primaryId },
          { id: primaryId, linkPrecedence: "primary" },
        ],
      },
    });

    allContacts = secondaries;

    // 4. If the incoming email/phoneNumber is new, create secondary
    const exists = secondaries.some(
      (c) => c.email === email && c.phoneNumber === phoneNumber
    );

    if (!exists) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primaryId,
          linkPrecedence: "secondary",
        },
      });
      allContacts.push(newContact);
    }
  } else {
    // 5. If no contact exists, create primary
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });
    primaryContact = newContact;
    allContacts = [newContact];
  }

  // 6. Compose response
  const primaryId = primaryContact!.id;
  const emails = [...new Set(allContacts.map((c) => c.email).filter(Boolean))];
  const phones = [...new Set(allContacts.map((c) => c.phoneNumber).filter(Boolean))];
  const secondaryIds = allContacts
    .filter((c) => c.linkPrecedence === "secondary")
    .map((c) => c.id);

  return {
    primaryContatctId: primaryId,
    emails,
    phoneNumbers: phones,
    secondaryContactIds: secondaryIds,
  };
};
