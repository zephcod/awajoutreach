import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const APP_URL = process.env.APP_URL ?? "https://example.com";

export interface LayoutProps {
  preview: string;
  children: React.ReactNode;
  /** Show marketing footer with unsubscribe link (omit for plain cold emails). */
  footer?: "marketing" | "transactional" | "none";
  recipientEmail?: string;
}

export function EmailLayout({ preview, children, footer = "none", recipientEmail }: LayoutProps) {
  const unsubUrl = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(recipientEmail ?? "")}`;
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", margin: 0 }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "24px" }}>
          {children}
          {footer === "marketing" && (
            <Section>
              <Hr style={{ borderColor: "#e5e7eb", margin: "28px 0 12px" }} />
              <Text style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "18px" }}>
                Awaj ET — Digital marketing for Ethiopian SMEs. Addis Ababa, Ethiopia.
                <br />
                You’re receiving this because you signed up or downloaded a resource from us.{" "}
                <Link href={unsubUrl} style={{ color: "#9ca3af", textDecoration: "underline" }}>
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          )}
          {footer === "transactional" && (
            <Section>
              <Hr style={{ borderColor: "#e5e7eb", margin: "28px 0 12px" }} />
              <Text style={{ fontSize: "12px", color: "#9ca3af" }}>
                Awaj ET · This is a service email about your account.
              </Text>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  );
}

/** Plain-text-looking paragraph — cold emails deliver best with minimal styling. */
export function P({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: "15px", lineHeight: "24px", color: "#111827", margin: "0 0 16px" }}>
      {children}
    </Text>
  );
}
