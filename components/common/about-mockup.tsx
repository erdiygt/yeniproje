export function AboutMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] pt-3 pr-3 sm:pt-4 sm:pr-4 lg:max-w-none">
      <div className="relative rounded-2xl bg-white/95 p-5 shadow-2xl sm:p-6 lg:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-text text-sm font-semibold text-[#101214]">
            ABS Arıza Raporu
          </span>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 font-text text-xs font-medium text-[#6B7280]">
              Açıklama
            </p>
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-[#DBEAFE]" />
              <div className="h-2.5 w-[85%] rounded-full bg-[#DBEAFE]" />
              <div className="h-2.5 w-[65%] rounded-full bg-[#DBEAFE]" />
            </div>
          </div>

          <div>
            <p className="mb-2 font-text text-xs font-medium text-[#6B7280]">
              Teşhis Adımları
            </p>
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-[#DBEAFE]" />
              <div className="h-2.5 w-[75%] rounded-full bg-[#DBEAFE]" />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            {["Bilgi", "Konsol", "Test", "Ağ"].map((tab, i) => (
              <span
                key={tab}
                className={`rounded-md px-2.5 py-1 font-text text-[11px] font-medium ${
                  i === 1
                    ? "bg-[#EBF2FF] text-[#165FC7]"
                    : "text-[#9CA3AF]"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="space-y-2 rounded-lg bg-[#F9FAFB] p-3">
            <div className="h-2 w-full rounded bg-[#BFDBFE]/60" />
            <div className="h-2 w-[90%] rounded bg-[#FECACA]/70" />
            <div className="h-2 w-[80%] rounded bg-[#BFDBFE]/60" />
          </div>
        </div>

        <div className="absolute -right-2 -top-2 h-14 w-14 rounded-full border-4 border-white shadow-lg sm:-right-3 sm:-top-3 sm:h-16 sm:w-16">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#34D399] to-[#059669]">
            <span className="font-display text-lg font-bold text-white sm:text-xl">M</span>
          </div>
        </div>

        <div className="absolute -bottom-2 right-6 sm:right-10">
          <div className="relative">
            <span className="absolute -left-3 -top-2 text-[#101214]">✦</span>
            <span className="absolute -right-4 -top-1 text-[#101214]">·</span>
            <span className="absolute -bottom-3 left-1 text-[#101214]">✦</span>
            <button
              type="button"
              className="rounded-lg bg-[#165FC7] px-4 py-2 font-text text-xs font-semibold text-white shadow-md"
              tabIndex={-1}
              aria-hidden="true"
            >
              Onayla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
