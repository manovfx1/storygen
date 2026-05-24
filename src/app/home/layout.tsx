import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={urbanist.className}>{children}</div>;
}
