import { Button, Heading, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout, P } from "../components/layout";

export interface LeadMagnetProps {
  firstName?: string;
  email?: string;
  downloadUrl?: string;
  resourceName?: string;
}

export default function LeadMagnetDelivery({
  firstName = "there",
  email = "",
  downloadUrl = "https://example.com/download",
  resourceName = "the SME Marketing Playbook",
}: LeadMagnetProps) {
  return (
    <EmailLayout preview={`Your copy of ${resourceName} is here`} footer="marketing" recipientEmail={email}>
      <Heading as="h2" style={{ fontSize: "20px", color: "#111827", margin: "0 0 16px" }}>
        Here’s your download, {firstName} 🎉
      </Heading>
      <P>
        Thanks for grabbing {resourceName}. It’s packed with practical steps you can apply to
        your business this week — no fluff.
      </P>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button
          href={downloadUrl}
          style={{
            backgroundColor: "#16a34a",
            color: "#ffffff",
            padding: "12px 28px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Download {resourceName}
        </Button>
      </Section>
      <P>
        Over the next few days I’ll send a couple of short emails with our best ideas for
        getting more of the right customers. If you’d rather not, the unsubscribe link below
        works instantly.
      </P>
      <P>— Abu, Awaj ET</P>
    </EmailLayout>
  );
}
