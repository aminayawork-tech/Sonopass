export const ARDMS_DISCLAIMER =
  'SonoPass is an independent study tool and is not affiliated with, endorsed by, or sponsored by the American Registry for Diagnostic Medical Sonography (ARDMS). ARDMS, RDMS, RDCS, RVT and RMSKS are trademarks of their respective owners. Practice questions are original and are not actual exam questions.';

export default function AppFooter() {
  return (
    <div className="px-5 pb-6 text-center">
      <p className="text-[11px] text-slate-400">SonoPass · Made for sonographers</p>
      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-2 max-w-md mx-auto">{ARDMS_DISCLAIMER}</p>
    </div>
  );
}
