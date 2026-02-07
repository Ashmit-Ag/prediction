import { SegmentedControl } from "@mantine/core";

export default function ManagerHeader({
  dataMode,
  setDataMode,
}: {
  dataMode: "real" | "test";
  setDataMode: (v: "real" | "test") => void;
}) {
  return (
    <div className="bg-zinc-900 px-6 py-5 border-b border-zinc-800">
      <h1 className="text-3xl text-center font-bold">
        Admin Betting Panel
      </h1>

      <SegmentedControl
        value={dataMode}
        onChange={(val) =>
          setDataMode(val as "real" | "test")
        }
        data={[
          { label: "Real Data", value: "real" },
          { label: "Test Data", value: "test" },
        ]}
      />
    </div>
  );
}
