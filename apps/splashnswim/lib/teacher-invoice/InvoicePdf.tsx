import path from "node:path";
import React from "react";
import { Document, Font, Page, Path, StyleSheet, Svg, Text, View, renderToBuffer } from "@react-pdf/renderer";
import {
  getSchool,
  type TeacherInvoice,
  formatDateSent,
  formatDayLong,
  formatDuration,
  formatMoney,
  formatMonth,
  formatNi,
  formatSortCode,
  invoiceRef,
  totalDue,
  totalMinutes,
} from "./schema";

// Brand fonts ship beside this file as static TTFs (PDFs can't use variable fonts).
const FONT_DIR = path.join(process.cwd(), "lib", "teacher-invoice", "fonts");

let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "Fredoka",
    fonts: [
      { src: path.join(FONT_DIR, "Fredoka-Medium.ttf"), fontWeight: 500 },
      { src: path.join(FONT_DIR, "Fredoka-SemiBold.ttf"), fontWeight: 600 },
    ],
  });
  Font.register({
    family: "Nunito Sans",
    fonts: [
      { src: path.join(FONT_DIR, "NunitoSans-Regular.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "NunitoSans-SemiBold.ttf"), fontWeight: 600 },
      { src: path.join(FONT_DIR, "NunitoSans-Bold.ttf"), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((w) => [w]); // never hyphenate names/addresses
  fontsRegistered = true;
}

// SplashNSwim Brand Guidelines v1.1 (July 2026), section 04.
const C = {
  deep: "#123B6D", // Deep Pool Blue: headings and body copy
  splash: "#087EDB", // Splash Blue: primary
  aqua: "#58D2DF", // Aqua: accent only, never text on white
  axolotl: "#F6A7BD", // Axolotl Pink: soft warmth
  gill: "#E96991", // Gill Pink: highlight
  warm: "#FAFCFD", // Warm White: backgrounds
  slate: "#5A6C86", // secondary text
  rule: "#D8E3EF",
  tint: "#EFF6FD",
};

const s = StyleSheet.create({
  page: { fontFamily: "Nunito Sans", fontSize: 10, color: C.deep, backgroundColor: C.warm, paddingTop: 40, paddingBottom: 64, paddingHorizontal: 48, lineHeight: 1.45 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  wordmark: { fontFamily: "Fredoka", fontWeight: 600, fontSize: 24, marginTop: 6 },
  wmSplash: { color: C.splash },
  wmN: { color: C.aqua, fontSize: 15 },
  wmSwim: { color: C.gill },
  schoolName: { fontFamily: "Fredoka", fontWeight: 600, fontSize: 20, marginTop: 8, maxWidth: 260 },
  plainRule: { marginTop: 14, borderBottomWidth: 2, borderBottomColor: C.deep },
  title: { fontFamily: "Fredoka", fontWeight: 600, fontSize: 26, lineHeight: 1.1, textAlign: "right", marginBottom: 6 },
  metaRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 1 },
  metaLabel: { color: C.slate, width: 70, textAlign: "right", marginRight: 8 },
  metaValue: { fontWeight: 700, minWidth: 92, textAlign: "right" },
  waves: { marginTop: 14 },
  parties: { flexDirection: "row", marginTop: 16, gap: 24 },
  party: { flex: 1 },
  h: { fontFamily: "Fredoka", fontWeight: 600, fontSize: 12, marginBottom: 6 },
  strong: { fontWeight: 700 },
  muted: { color: C.slate },
  section: { marginTop: 20 },
  tr: { flexDirection: "row", paddingVertical: 3.5, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.rule },
  th: { color: C.slate, fontWeight: 700, fontSize: 9, borderTopWidth: 1, borderTopColor: C.rule },
  colDate: { flex: 1 },
  colHours: { width: 80, textAlign: "right" },
  closing: { flexDirection: "row", gap: 28, marginTop: 20, alignItems: "flex-start" },
  payTo: { flex: 1 },
  summary: { width: 250 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.rule },
  sumLabel: { color: C.slate },
  sumValue: { fontWeight: 700 },
  dueRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: C.deep, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 10, marginTop: 6 },
  dueLabel: { fontFamily: "Fredoka", fontWeight: 600, fontSize: 13, color: C.warm },
  dueValue: { fontFamily: "Fredoka", fontWeight: 600, fontSize: 18, color: C.warm },
  bankBox: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: C.rule, borderLeftWidth: 4, borderLeftColor: C.axolotl, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
  bankItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  bankLabel: { color: C.slate },
  bankValue: { fontWeight: 700, fontSize: 10.5 },
  footer: { position: "absolute", left: 48, bottom: 28, width: 499, borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 8, fontSize: 8, color: C.slate, flexDirection: "row", justifyContent: "space-between" },
});

// Wave lines from section 07 (Aqua over Axolotl Pink), used once as the header divider.
function Waves() {
  const w = 499;
  const wave = (y: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x < w; x += 125) d += ` q31.25 -4 62.5 0 t62.5 0`;
    return d;
  };
  return (
    <Svg width={w} height={14} viewBox={`0 0 ${w} 14`} style={s.waves}>
      <Path d={wave(5)} stroke={C.aqua} strokeWidth={1.6} fill="none" />
      <Path d={wave(11)} stroke={C.axolotl} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

function InvoiceDocument({ inv, dateSent }: { inv: TeacherInvoice; dateSent: string }) {
  const ref = invoiceRef(inv);
  const school = getSchool(inv.school)!;
  const isSns = school.id === "splashnswim";

  return (
    <Document title={`Invoice ${ref} – ${inv.name}`} author={inv.name} subject={`Hours for ${formatMonth(inv.month)}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {isSns ? (
            // Wordmark set in Fredoka SemiBold, as the SplashNSwim guidelines allow (section 03).
            <Text style={s.wordmark}>
              <Text style={s.wmSplash}>Splash</Text>
              <Text style={s.wmN}>{" ~ N ~ "}</Text>
              <Text style={s.wmSwim}>Swim</Text>
            </Text>
          ) : (
            // No brand assets for other schools, so their name is set plainly.
            <Text style={s.schoolName}>{school.name}</Text>
          )}
          <View>
            <Text style={s.title}>Invoice</Text>
            <View style={s.metaRow}><Text style={s.metaLabel}>Reference</Text><Text style={s.metaValue}>{ref}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Date sent</Text><Text style={s.metaValue}>{formatDateSent(dateSent)}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Period</Text><Text style={s.metaValue}>{formatMonth(inv.month)}</Text></View>
          </View>
        </View>
        {isSns ? <Waves /> : <View style={s.plainRule} />}

        <View>
          <View style={s.parties}>
            <View style={s.party}>
              <Text style={s.h}>From</Text>
              <Text style={s.strong}>{inv.name}</Text>
              {inv.address.split(/\r?\n/).filter(Boolean).map((l, i) => <Text key={i}>{l}</Text>)}
              <Text style={s.muted}>{inv.email}</Text>
              <Text style={{ marginTop: 6 }}><Text style={s.muted}>National Insurance no. </Text><Text style={s.strong}>{formatNi(inv.niNumber)}</Text></Text>
            </View>
            <View style={s.party}>
              <Text style={s.h}>To</Text>
              <Text style={s.strong}>{school.legalName}</Text>
              {school.tradingAs && <Text style={s.muted}>trading as {school.tradingAs}</Text>}
              {school.addressLines.map((l) => <Text key={l}>{l}</Text>)}
              {school.companyNo && <Text style={s.muted}>Company no. {school.companyNo}</Text>}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.h}>Days worked</Text>
            <View style={[s.tr, s.th]} fixed>
              <Text style={s.colDate}>Date</Text>
              <Text style={s.colHours}>Hours</Text>
            </View>
            {inv.days.map((d) => (
              <View style={s.tr} key={d.date} wrap={false}>
                <Text style={s.colDate}>{formatDayLong(d.date)}</Text>
                <Text style={s.colHours}>{formatDuration(d.minutes)}</Text>
              </View>
            ))}

          </View>

          <View style={s.closing} wrap={false}>
            <View style={s.payTo}>
              <Text style={s.h}>Pay to</Text>
              <View style={s.bankBox}>
                <View style={s.bankItem}><Text style={s.bankLabel}>Account name</Text><Text style={s.bankValue}>{inv.bank.accountName}</Text></View>
                <View style={s.bankItem}><Text style={s.bankLabel}>Sort code</Text><Text style={s.bankValue}>{formatSortCode(inv.bank.sortCode)}</Text></View>
                <View style={s.bankItem}><Text style={s.bankLabel}>Account number</Text><Text style={s.bankValue}>{inv.bank.accountNumber}</Text></View>
              </View>
            </View>
            <View style={s.summary}>
              <Text style={s.h}>Summary</Text>
              <View style={s.sumRow}><Text style={s.sumLabel}>Days worked</Text><Text style={s.sumValue}>{inv.days.length}</Text></View>
              <View style={s.sumRow}><Text style={s.sumLabel}>Total hours for {formatMonth(inv.month)}</Text><Text style={s.sumValue}>{formatDuration(totalMinutes(inv.days))}</Text></View>
              <View style={s.sumRow}><Text style={s.sumLabel}>Hourly rate</Text><Text style={s.sumValue}>{formatMoney(inv.rate)}</Text></View>
              <View style={s.dueRow}><Text style={s.dueLabel}>Total due</Text><Text style={s.dueValue}>{formatMoney(totalDue(inv))}</Text></View>
            </View>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text>Invoice {ref} from {inv.name} to {school.legalName}</Text>
          <Text>{formatMonth(inv.month)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(inv: TeacherInvoice, dateSent: string): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<InvoiceDocument inv={inv} dateSent={dateSent} />);
}
