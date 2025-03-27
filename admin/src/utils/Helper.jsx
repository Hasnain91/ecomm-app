// Function to highlight the search term in text
export const highlightSearchTerm = (text, term) => {
  if (!term) return text; // If no search term, return the original text
  const regex = new RegExp(`(${term})`, "gi"); // Case-insensitive match
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-pink-300 font-bold text-pink-600">
        {part}
      </span>
    ) : (
      part
    )
  );
};
