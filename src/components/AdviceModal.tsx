type AdviceModalProps = {
  advice: string | null;
  isLoading: boolean;
  error: string;
  onClose: () => void;
};

const AdviceModal = ({
  advice,
  isLoading,
  error,
  onClose,
}: AdviceModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className="w-full max-w-md rounded-xl border p-6"
        style={{ background: "#0A0F0D", borderColor: "rgba(62,207,142,0.3)" }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">AI advice</h3>

        {isLoading && <p style={{ color: "#5E7A6F" }}>Generating advice...</p>}
        {error && <p style={{ color: "#E0574C" }}>{error}</p>}

        {!isLoading && !error && advice && (
          <div
            className="rounded-lg border p-4 mb-5 text-sm leading-relaxed"
            style={{ borderColor: "rgba(62,207,142,0.3)", color: "#DCEAE3" }}
          >
            {advice}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-black cursor-pointer"
          style={{ background: "#3ECF8E" }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdviceModal;
