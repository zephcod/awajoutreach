import { Column, Heading, Row, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout, P } from "../components/layout";

export interface ReceiptProps {
  firstName?: string;
  invoiceNumber?: string;
  amount?: string;
  service?: string;
  date?: string;
}

export default function Receipt({
  firstName = "there",
  invoiceNumber = "INV-0001",
  amount = "ETB 0.00",
  service = "Marketing services",
  date = new Date().toLocaleDateString("en-GB"),
}: ReceiptProps) {
  const cell = { fontSize: "14px", color: "#111827", padding: "8px 0" };
  return (
    <EmailLayout preview={`Receipt ${invoiceNumber} — ${amount}`} footer="transactional">
      <Heading as="h2" style={{ fontSize: "20px", color: "#111827", margin: "0 0 16px" }}>
        Payment received — thank you, {firstName}
      </Heading>
      <Section style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
        <Row><Column style={{ ...cell, color: "#6b7280" }}>Invoice</Column><Column style={{ ...cell, textAlign: "right" as const }}>{invoiceNumber}</Column></Row>
        <Row><Column style={{ ...cell, color: "#6b7280" }}>Service</Column><Column style={{ ...cell, textAlign: "right" as const }}>{service}</Column></Row>
        <Row><Column style={{ ...cell, color: "#6b7280" }}>Date</Column><Column style={{ ...cell, textAlign: "right" as const }}>{date}</Column></Row>
        <Row><Column style={{ ...cell, color: "#6b7280", fontWeight: 600 }}>Total</Column><Column style={{ ...cell, textAlign: "right" as const, fontWeight: 600 }}>{amount}</Column></Row>
      </Section>
      <P>Keep this email for your records. Questions? Just reply.</P>
    </EmailLayout>
  );
}
