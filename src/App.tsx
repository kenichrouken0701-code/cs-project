import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [analysisResult, setAnalysisResult] = useState("");
  const [strategyData, setStrategyData] =
useState<any[]>([]);

  const [todayTime, setTodayTime] =
useState("分析待ち");

const [todayList, setTodayList] =
useState("分析待ち");

const [todayReason, setTodayReason] =
useState("分析待ち");

const [todayIndustry, setTodayIndustry] =
useState("分析待ち");
  console.log(import.meta.env.VITE_GEMINI_API_KEY);
const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hookTab, setHookTab] = useState<"electric" | "hp" | "other">("electric");

  const [otherMemo, setOtherMemo] =
  useState("");

  const [coolNumber, setCoolNumber] = useState("");
  const [listName, setListName] = useState("");
  const [calls, setCalls] = useState("");
  const [effective, setEffective] = useState("");
  const [decisionMaker, setDecisionMaker] = useState("");
  const [tossCount, setTossCount] = useState("");
  const [appointmentCount, setAppointmentCount] = useState("");
  const [approachNg, setApproachNg] = useState("");
  const [purposeNg, setPurposeNg] = useState("");
  const [indoorNg, setIndoorNg] = useState("");
  const [electricNg, setElectricNg] = useState("");
  const [tesukuroNg, setTesukuroNg] = useState("");
  const [closingNg, setClosingNg] = useState("");
  const [scheduleNg, setScheduleNg] = useState("");
  const [memo, setMemo] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
const [otherApRecords, setOtherApRecords] = useState<any[]>([]);
const [historyTab, setHistoryTab] = useState<
  "electric" | "hp" | "other"
>("electric");

  const today = new Date().toLocaleDateString("ja-JP");
  const [otherApName, setOtherApName] = useState("");
const [otherTime, setOtherTime] = useState("");
const [otherIndustry, setOtherIndustry] = useState("");
const [otherHookType, setOtherHookType] = useState("電気フック");

  const inputClass =
    "rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none text-white placeholder:text-gray-500";

  const resetForm = () => {
    setCoolNumber("");
    setListName("");
    setCalls("");
    setEffective("");
    setDecisionMaker("");
    setTossCount("");
    setAppointmentCount("");
    setApproachNg("");
    setPurposeNg("");
    setIndoorNg("");
    setElectricNg("");
    setTesukuroNg("");
    setClosingNg("");
    setScheduleNg("");
    setMemo("");
  };

  const fetchRecords = async () => {
  const { data, error } = await supabase
    .from("cool_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setRecords(data || []);
};

const fetchOtherApRecords = async () => {
  const { data, error } = await supabase
    .from("other_ap_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setOtherApRecords(data || []);
};

const deleteHistory = async () => {
  const ok = confirm("本当に全履歴を削除しますか？");

  if (!ok) return;

  const { error: coolError } = await supabase
    .from("cool_records")
    .delete()
    .neq("id", "");

  const { error: otherError } = await supabase
    .from("other_ap_records")
    .delete()
    .neq("id", "");

  if (coolError || otherError) {
    alert("削除失敗");
    console.error(coolError, otherError);
    return;
  }

  fetchRecords();
  fetchOtherApRecords();

  alert("全履歴削除完了");

};
  const deleteRecord = async (id: string) => {
  const ok = confirm("この履歴を削除しますか？");

  if (!ok) return;

  const { data, error } = await supabase
    .from("cool_records")
    .delete()
    .eq("id", id)
    .select();

  console.log("削除結果", data);
  console.log("削除エラー", error);

  if (error) {
    console.error(error);
    alert(JSON.stringify(error));
    return;
  }

  fetchRecords();

  alert("削除完了");
};
const runGeminiAnalysis = async () => {
  alert("分析開始！");
  try {
    setIsAnalyzing(true);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        import.meta.env.VITE_GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
あなたは日本トップクラスの営業マネージャーです。

営業データを分析し、
「今どこに電話すれば最もアポ率が高いか」
を判断してください。

=================================
草間データ
=================================

${JSON.stringify(records)}

=================================
他APデータ
=================================

${JSON.stringify(otherApRecords)}

=================================
出力ルール
=================================

抽象論は禁止。

必ず

曜日
時間帯
リスト

を具体的に出してください。

営業現場でそのまま使えるレベルで回答してください。

評価は

S
A
B
C

で判定してください。

=================================
① 今日の営業戦略（最重要）
=================================

10:00〜11:00

11:00〜12:00

12:00〜13:00

13:00〜14:00

14:00〜15:00

15:00〜16:00

16:00〜17:00

17:00〜18:00

18:00〜19:00

それぞれ

・おすすめリスト
・期待度
・理由

を出してください。

例

10:00〜11:00

美容

期待度A

理由
決裁者接続率が高い

=================================
② 曜日別ランキング
=================================

月曜〜日曜

成果期待値順に

S〜C

でランキング化してください。

=================================
③ 時間帯別ランキング
=================================

10:00〜19:00

成果期待値順に

S〜C

でランキング化してください。

=================================
④ リスト別ランキング
=================================

成果が出やすいリスト

TOP10

を出してください。

=================================
⑤ 曜日×時間帯×リスト分析
=================================

最も成果が出やすい組み合わせを

TOP10

出してください。

例

月曜日
14:00〜15:00
美容

期待度S

=================================
⑥ 明日の営業プラン
=================================

明日の行動を

10:00〜19:00

1時間単位で作成してください。

=================================
⑦ 今週の営業スケジュール
=================================

月曜〜日曜

おすすめ営業プランを作成してください。

=================================
⑧ NG分析
=================================

以下を分析してください。

・アプローチNG
・主旨NG
・インドアNG
・電気NG
・テスクロNG
・クロージングNG
・前確調整NG

どのNGが多いか

なぜ発生しているか

改善方法

を出してください。

=================================
⑨ TOP AP比較分析
=================================

他APデータと比較し

草間が

勝っている部分

負けている部分

を分析してください。

=================================
⑩ 改善優先順位TOP5
=================================

草間が最短でアポ率を上げるために

やるべき改善を

重要度順に5つ出してください。

それぞれ

・理由
・改善方法
・期待効果

を具体的に説明してください。

=================================
⑪ 次の1週間で狙うべきリスト
=================================

どのリストへ優先的に架電すべきか

TOP10

を出してください。

期待度

S
A
B
C

付きで出してください。

=================================
⑫ マネージャー総評
=================================

最後に

草間専属営業マネージャーとして

率直な評価

今後の課題

次週の重点テーマ

をまとめてください。

=================================
⑬ 時間別戦略データ
=================================

最後に必ず以下形式で出力してください。

STRATEGY_DATA_START

10:00〜11:00|美容|決裁率12%
11:00〜12:00|整体|決裁率18%
12:00〜13:00|飲食|アポ率11%
13:00〜14:00|不動産|決裁率14%
14:00〜15:00|美容|決裁率20%
15:00〜16:00|整体|アポ率13%
16:00〜17:00|飲食|決裁率17%
17:00〜18:00|美容|アポ率15%
18:00〜19:00|不動産|決裁率10%

STRATEGY_DATA_END
                  `,
                },
              ],
            },
          ],
        }),
      }
    );
alert("分析完了！");
    const data = await response.json();

    console.log(data);

    const result =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "分析結果取得失敗";
      const todayTimeMatch =
  result.match(/TODAY_TIME:\s*(.*)/);

const todayListMatch =
  result.match(/TODAY_LIST:\s*(.*)/);

const todayReasonMatch =
  result.match(/TODAY_REASON:\s*(.*)/);

const industryMatch =
result.match(/TODAY_INDUSTRY:(.*)/);

if (industryMatch) {
  setTodayIndustry(
    industryMatch[1].trim()
  );
}

if (todayTimeMatch) {
  setTodayTime(todayTimeMatch[1]);
}

if (todayListMatch) {
  setTodayList(todayListMatch[1]);
}

if (todayReasonMatch) {
  setTodayReason(todayReasonMatch[1]);
}
const strategyMatch =
  result.match(
    /STRATEGY_DATA_START([\s\S]*?)STRATEGY_DATA_END/
  );

if (strategyMatch) {
  const lines =
    strategyMatch[1]
      .trim()
      .split("\n");

  const parsed = lines.map(
    (line) => {
      const parts =
        line.split("|");

      return {
        time: parts[0],
        list: parts[1],
        reason: parts[2],
      };
    }
  );

  setStrategyData(parsed);
}
    setAnalysisResult(result);
  } catch (error: any) {
  console.error(error);

  alert(
    JSON.stringify(error, null, 2)
  );
} finally {
    setIsAnalyzing(false);
  }
};
const deleteOtherRecord = async (id: number) => {
  console.log("削除対象ID", id);

  const { data, error } = await supabase
    .from("other_ap_records")
    .delete()
    .eq("id", id)
    .select();

  console.log("data", data);
  console.log("error", error);

  alert(
    JSON.stringify({
      data,
      error,
    })
  );

  fetchOtherApRecords();
};
  const saveRecord = async () => {

  // =====================================
  // 他AP記録 保存
  // =====================================
  if (hookTab === "other") {

    const { error } = await supabase
      .from("other_ap_records")
      .insert([
        {
          ap_name: otherApName,

          weekday: new Date().toLocaleDateString(
    "ja-JP",
    { weekday: "long" }
  ),
          hook_type: otherHookType,
          time_slot: otherTime,
          list_name: otherIndustry,
          memo: otherMemo,
        },
      ]);

    if (error) {
      console.error(error);
      alert(JSON.stringify(error));
      return;
    }

    alert("他AP記録保存成功！");

setOtherApName("");
setOtherTime("");
setOtherIndustry("");
setOtherHookType("電気フック");
setOtherMemo("");

fetchOtherApRecords();

setIsModalOpen(false);

return;
  }

  // =====================================
  // 電気・HPフック 保存
  // =====================================
  const { error } = await supabase
    .from("cool_records")
    .insert([
      {
        user_name: "草間",

        weekday: new Date().toLocaleDateString(
    "ja-JP",
    { weekday: "long" }
  ),

        hook_type:
          hookTab === "electric"
            ? "電気フック"
            : "HPフック",

        cool_number: Number(coolNumber),

        list_name: listName,

        calls: Number(calls),
        effective: Number(effective),
        decision_maker: Number(decisionMaker),

        toss_count: Number(tossCount),
        appointment_count: Number(appointmentCount),

        approach_ng: Number(approachNg),
        purpose_ng: Number(purposeNg),

        indoor_ng:
          hookTab === "electric"
            ? Number(indoorNg)
            : 0,

        electric_ng:
          hookTab === "electric"
            ? Number(electricNg)
            : 0,

        tesukuro_ng:
          hookTab === "electric"
            ? Number(tesukuroNg)
            : 0,

        close_ng:
          hookTab === "hp"
            ? Number(closingNg)
            : 0,

        schedule_ng:
          hookTab === "hp"
            ? Number(scheduleNg)
            : 0,

        memo,
      },
    ]);

  if (error) {
    console.error(error);
    alert(JSON.stringify(error));
    return;
  }

  alert("保存成功！");

  resetForm();

  fetchRecords();

  setIsModalOpen(false);
};
  const timeOptions = [];

for (let hour = 10; hour <= 19; hour++) {
  timeOptions.push(`${String(hour).padStart(2, "0")}:00`);

  if (hour !== 19) {
    timeOptions.push(`${String(hour).padStart(2, "0")}:30`);
  }
}

  useEffect(() => {
  fetchRecords();
  fetchOtherApRecords();
}, []);

useEffect(() => {
  if (!strategyData.length) return;

  const updateStrategy = () => {
    const now =
      new Date().getHours();

    const current =
      strategyData.find(
        (item) =>
          Number(
            item.time
              .split(":")[0]
          ) === now
      );

    if (!current) return;

    setTodayTime(current.time);
    setTodayList(current.list);
    setTodayReason(current.reason);
  };

  updateStrategy();

  const timer =
    setInterval(
      updateStrategy,
      60000
    );

  return () =>
    clearInterval(timer);
}, [strategyData]);

useEffect(() => {
  resetForm();
}, [hookTab]);

const filteredRecords = records.filter((record) => {
  if (historyTab === "electric") {
    return record.hook_type === "電気フック";
  }

  if (historyTab === "hp") {
    return record.hook_type === "HPフック";
  }

  return false;
});

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2400&auto=format&fit=crop')",
        }}
      />

      <div className="fixed inset-0 bg-black/55" />
      <div className="fixed right-0 top-0 h-full w-[34%] bg-gradient-to-l from-black/80 to-transparent" />

      <div className="relative z-10 px-[58px] py-[34px]">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.45em] text-gray-300">
              SALES STRATEGY INTELLIGENCE
            </p>

            <h1 className="mt-4 text-[44px] font-thin tracking-[0.34em]">
              C.S PROJECT
            </h1>
          </div>

          
        </header>

        <main className="mt-10 flex items-start justify-between gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-[520px]"
          >
            <h2
              className="text-[74px] leading-[1.22] font-thin"
              style={{ fontFamily: "'Noto Serif JP', serif" }}
            >
              営業を、
              <br />
              戦略へ。
            </h2>

            <div className="mt-6 h-[1px] w-16 bg-[#c9a96d]" />

            <p className="mt-6 text-[17px] leading-[1.9] text-gray-200">
              時間帯、業種、リスト、決裁率。
              <br />
              すべての営業データを蓄積し、
              AIが最適解を導き出す。
            </p>

            <div className="mt-9 flex gap-10 text-[20px]">
              <button className="relative">
                電気フック
                <span className="absolute -bottom-3 left-0 h-[2px] w-full bg-[#c9a96d]" />
              </button>

              <button className="text-gray-300">HPフック</button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-10 rounded-full border border-[#c9a96d]/40 bg-black/30 px-8 py-3 text-[15px] tracking-[0.15em] text-white backdrop-blur-xl transition hover:bg-[#c9a96d] hover:text-black"
            >
              営業記録を入力
            </button>
          </motion.div>

          <div className="flex flex-col gap-12 pt-10">
            <div
  onClick={runGeminiAnalysis}
  className="cursor-pointer transition hover:opacity-70"
>
  <h3 className="text-[46px] font-thin">
    AI分析
  </h3>

  <p className="mt-2 text-[15px] text-gray-300">
    時間帯・業種データ分析
  </p>
</div>

            <div
  onClick={() =>
    document
      .getElementById("history")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
  className="cursor-pointer transition hover:opacity-70"
>
  <h3 className="text-[46px] font-thin">
    History
  </h3>

  <p className="mt-2 text-[15px] text-gray-300">
    過去営業データ閲覧
  </p>
</div>

            <div>
              <h3 className="text-[46px] font-thin">
  白地エリア
</h3>

<p className="mt-2 text-[15px] text-gray-300">
  白地抽出ツール
</p>
            </div>
          </div>
        </main>

        <section className="mt-16">

  <div className="rounded-[32px] border border-white/10 bg-black/20 backdrop-blur-xl p-8">

    <p className="text-[12px] tracking-[0.35em] text-[#c9a96d]">
      NOW STRATEGY
    </p>

    <div className="mt-6 grid grid-cols-2 gap-10">

      <div>

        <h2 className="text-[54px] font-thin">
          {todayTime}
        </h2>

        <div className="mt-5 h-[1px] w-16 bg-[#c9a96d]" />

        <h3 className="mt-6 text-[36px] font-thin">
          {todayList}
        </h3>

        <p className="mt-3 text-[22px] text-gray-300">
          {todayIndustry}
        </p>

      </div>

      <div>

        <p className="text-[12px] tracking-[0.35em] text-[#c9a96d]">
          WHY NOW ?
        </p>

        <p className="mt-6 whitespace-pre-wrap text-[16px] leading-[2] text-gray-200">
          {todayReason}
        </p>

      </div>

    </div>

  </div>

</section>
        {analysisResult && (

<div className="mt-16 rounded-[30px] border border-white/10 bg-black/20 p-8 backdrop-blur-xl">

  <h2 className="mb-6 text-[28px] font-thin">
    GEMINI ANALYSIS
  </h2>

  <pre className="whitespace-pre-wrap text-[14px] leading-[2] text-gray-200">
    {analysisResult}
  </pre>

</div>

)}

        <section
  id="history"
  className="mt-16"
>
          <div className="mb-6 flex items-center justify-between">

  <h2 className="text-[28px] font-thin">
    HISTORY
  </h2>


</div>
          <div className="mb-6 flex gap-4">
  <button
    onClick={() => setHistoryTab("electric")}
    className={
      historyTab === "electric"
        ? "text-[#c9a96d]"
        : "text-gray-500"
    }
  >
    電気フック
  </button>

  <button
    onClick={() => setHistoryTab("hp")}
    className={
      historyTab === "hp"
        ? "text-[#c9a96d]"
        : "text-gray-500"
    }
  >
    HPフック
  </button>

  <button
    onClick={() => setHistoryTab("other")}
    className={
      historyTab === "other"
        ? "text-[#c9a96d]"
        : "text-gray-500"
    }
  >
    他AP
  </button>
</div>

        <div className="flex gap-5 overflow-x-auto pb-4">
            {historyTab === "other" && (

  <div className="flex gap-5 overflow-x-auto pb-4">

    {otherApRecords.map((record, index) => (

      <div
        key={index}
        className="min-w-[320px] rounded-[28px] border border-white/10 bg-black/20 p-6 backdrop-blur-xl"
      >

        <div className="flex items-center justify-between">

  <p className="text-[#c9a96d] text-[12px]">
    {record.hook_type}
  </p>

  <button
    onClick={() => deleteOtherRecord(record.id)}
    className="text-red-400 hover:text-red-300"
  >
    🗑
  </button>

</div>

        <h3 className="mt-3 text-[28px] font-thin">
          {record.ap_name}
        </h3>

        <div className="mt-4 h-[1px] w-12 bg-[#c9a96d]" />

        <div className="mt-5 space-y-2 text-[14px] text-gray-200">

          <p>時間：{record.time_slot}</p>

          <p>リスト：{record.list_name}</p>
          {record.memo && (
  <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
    <p className="text-[10px] tracking-[0.35em] text-[#c9a96d]">
      MEMO
    </p>

    <p className="mt-2 text-[13px] leading-[1.8] text-gray-300">
      {record.memo}
    </p>
  </div>
)}

        </div>

      </div>

    ))}

  </div>

)}
            {filteredRecords.map((record, index) => (
              <div
                key={index}
                className="min-w-[340px] rounded-[28px] border border-white/10 bg-black/20 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">

  <p className="text-[10px] tracking-[0.35em] text-[#c9a96d]">
    {record.hook_type}
  </p>

  <button
    onClick={() => deleteRecord(record.id)}
    className="text-red-400 hover:text-red-300"
  >
    🗑
  </button>

</div>

                <div className="mt-3 flex items-center justify-between">
                  <h3 className="text-[30px] font-thin">
                    {record.list_name}
                  </h3>
                  <p className="text-gray-400">
                    第{record.cool_number}クール
                  </p>
                </div>

                <div className="mt-4 h-[1px] w-12 bg-[#c9a96d]" />

                <div className="mt-5 grid grid-cols-2 gap-y-2 text-[14px] text-gray-200">
                  <p>コール</p>
                  <p>{record.calls}</p>

                  <p>有効</p>
                  <p>{record.effective}</p>

                  <p>決裁</p>
                  <p>{record.decision_maker}</p>

                  <p>トス</p>
                  <p>{record.toss_count}</p>

                  <p>アポ</p>
                  <p>{record.appointment_count}</p>

                  <p>アプロNG</p>
                  <p>{record.approach_ng}</p>

                  <p>主旨NG</p>
                  <p>{record.purpose_ng}</p>

                  {record.hook_type === "電気フック" && (
                    <>
                      <p>インドアNG</p>
                      <p>{record.indoor_ng}</p>

                      <p>電気NG</p>
                      <p>{record.electric_ng}</p>

                      <p>テスクロNG</p>
                      <p>{record.tesukuro_ng}</p>
                    </>
                  )}

                  {record.hook_type === "HPフック" && (
                    <>
                      <p>クロージングNG</p>
                      <p>{record.close_ng}</p>

                      <p>前確調整NG</p>
                      <p>{record.schedule_ng}</p>
                    </>
                  )}
                </div>

                {record.memo && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] tracking-[0.35em] text-[#c9a96d]">
                      MEMO
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.8] text-gray-300">
                      {record.memo}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 flex items-end justify-between pb-10 text-gray-300">
          <div>
            <p className="text-[22px] tracking-[0.22em]">C.S PROJECT</p>
            <p className="mt-1 text-[12px] text-gray-400">
              Sales Strategy Intelligence
            </p>
          </div>

          <div className="text-right text-[12px]">
            <p>© 2026 C.S PROJECT</p>
            <p className="mt-1 text-gray-400">All rights reserved.</p>
          </div>
        </footer>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-h-[90vh] w-[900px] overflow-y-auto rounded-[30px] border border-white/10 bg-black/60 p-10 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <button
                  onClick={() => setHookTab("electric")}
                  className={`pb-2 text-[18px] font-thin transition ${
                    hookTab === "electric"
                      ? "border-b border-[#c9a96d] text-white"
                      : "text-gray-500"
                  }`}
                >
                  電気フック
                </button>

                <button
                  onClick={() => setHookTab("hp")}
                  className={`pb-2 text-[18px] font-thin transition ${
                    hookTab === "hp"
                      ? "border-b border-[#c9a96d] text-white"
                      : "text-gray-500"
                  }`}
                >
                  HPフック
                </button>
                <button
  onClick={() => setHookTab("other")}
  className={`pb-2 text-[18px] font-thin transition ${
    hookTab === "other"
      ? "border-b border-[#c9a96d] text-white"
      : "text-gray-500"
  }`}
>
  他AP記録
</button>
<div className="ml-8 flex items-center gap-3">


</div>
              
  </div>


              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {hookTab === "electric" && (
              <div className="mt-8 grid grid-cols-2 gap-5">
                <div className="col-span-2 rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-gray-300">
                  日付：{today}
                </div>

                <input value={coolNumber} onChange={(e) => setCoolNumber(e.target.value)} placeholder="クール番号" className={inputClass} />
                <input value={listName} onChange={(e) => setListName(e.target.value)} placeholder="リスト名" className={inputClass} />
                <input value={calls} onChange={(e) => setCalls(e.target.value)} placeholder="コール数" className={inputClass} />
                <input value={effective} onChange={(e) => setEffective(e.target.value)} placeholder="有効数" className={inputClass} />
                <input value={decisionMaker} onChange={(e) => setDecisionMaker(e.target.value)} placeholder="決裁者有効" className={inputClass} />
                <input value={tossCount} onChange={(e) => setTossCount(e.target.value)} placeholder="トス数" className={inputClass} />
                <input value={appointmentCount} onChange={(e) => setAppointmentCount(e.target.value)} placeholder="アポ数" className={inputClass} />
                <input value={approachNg} onChange={(e) => setApproachNg(e.target.value)} placeholder="アプローチNG" className={inputClass} />
                <input value={purposeNg} onChange={(e) => setPurposeNg(e.target.value)} placeholder="主旨NG" className={inputClass} />
                <input value={indoorNg} onChange={(e) => setIndoorNg(e.target.value)} placeholder="インドアNG" className={inputClass} />
                <input value={electricNg} onChange={(e) => setElectricNg(e.target.value)} placeholder="電気NG" className={inputClass} />
                <input value={tesukuroNg} onChange={(e) => setTesukuroNg(e.target.value)} placeholder="テスクロNG" className={inputClass} />

                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="メモ"
                  className="col-span-2 min-h-[120px] rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white placeholder:text-gray-500 outline-none"
                />
              </div>
            )}

            {hookTab === "hp" && (
              <div className="mt-8 grid grid-cols-2 gap-5">
                <div className="col-span-2 rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-gray-300">
                  日付：{today}
                </div>

                <input value={coolNumber} onChange={(e) => setCoolNumber(e.target.value)} placeholder="クール番号" className={inputClass} />
                <input value={listName} onChange={(e) => setListName(e.target.value)} placeholder="リスト名" className={inputClass} />
                <input value={calls} onChange={(e) => setCalls(e.target.value)} placeholder="コール数" className={inputClass} />
                <input value={effective} onChange={(e) => setEffective(e.target.value)} placeholder="有効数" className={inputClass} />
                <input value={decisionMaker} onChange={(e) => setDecisionMaker(e.target.value)} placeholder="決裁者有効" className={inputClass} />
                <input value={tossCount} onChange={(e) => setTossCount(e.target.value)} placeholder="トス数" className={inputClass} />
                <input value={appointmentCount} onChange={(e) => setAppointmentCount(e.target.value)} placeholder="アポ数" className={inputClass} />
                <input value={approachNg} onChange={(e) => setApproachNg(e.target.value)} placeholder="アプローチNG" className={inputClass} />
                <input value={purposeNg} onChange={(e) => setPurposeNg(e.target.value)} placeholder="主旨NG" className={inputClass} />
                <input value={closingNg} onChange={(e) => setClosingNg(e.target.value)} placeholder="クロージングNG" className={inputClass} />
                <input value={scheduleNg} onChange={(e) => setScheduleNg(e.target.value)} placeholder="前確日程調整NG" className={inputClass} />

                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="メモ"
                  className="col-span-2 min-h-[120px] rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white placeholder:text-gray-500 outline-none"
                />
              </div>
            )}
            {/* 他AP記録 */}
{hookTab === "other" && (

  <div className="mt-8 grid grid-cols-2 gap-5">

    <div className="col-span-2 rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-gray-300">
      日付：{today}
    </div>

    {/* 1段目 */}
<input
  value={otherApName}
  onChange={(e) => setOtherApName(e.target.value)}
  placeholder="AP名"
  className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none"
/>

<select
  value={otherHookType}
  onChange={(e) => setOtherHookType(e.target.value)}
  className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none"
>
  <option value="電気フック">電気フック</option>
  <option value="HPフック">HPフック</option>
</select>

{/* 2段目 */}
<select
  value={otherTime}
  onChange={(e) => setOtherTime(e.target.value)}
  className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none"
>
  <option value="">時間選択</option>

  {timeOptions.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>

<input
  value={otherIndustry}
  onChange={(e) => setOtherIndustry(e.target.value)}
  placeholder="リスト名"
  className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none"
/>
<textarea
  value={otherMemo}
  onChange={(e) =>
    setOtherMemo(e.target.value)
  }
  placeholder="メモ"
  className="
    col-span-2
    min-h-[120px]
    rounded-xl
    border
    border-white/10
    bg-black/20
    px-5
    py-4
    text-white
    placeholder:text-gray-500
    outline-none
  "
/>

  </div>

)}

            <button
              onClick={saveRecord}
              className="mt-8 rounded-full bg-[#c9a96d] px-8 py-3 text-black"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}