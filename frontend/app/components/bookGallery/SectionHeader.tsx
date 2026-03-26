export default function SectionHeader({ title, line, buttonText, onClick }: {title: string, line: Boolean, buttonText?: string, onClick?: ()=>void}) {
    const classes = `flex justify-between items-center  pb-4 mb-6 ${line ? "border-b border-gray-700" : ""}`
    return (
      <div className={classes}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {buttonText && (
          <button className="px-4 py-2 bg-gray-800 text-sm rounded hover:bg-gray-700" onClick={onClick}>
            {buttonText}
          </button>
        )}
      </div>
    );
}