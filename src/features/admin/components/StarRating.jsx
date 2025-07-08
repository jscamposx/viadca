const Star = ({ filled, onClick }) => (
  <span
    onClick={onClick}
    style={{
      cursor: "pointer",
      color: filled ? "gold" : "lightgray",
      fontSize: "24px",
    }}
  >
    ★
  </span>
);

const StarRating = ({ rating, setRating }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          filled={value <= rating}
          onClick={() => setRating(value)}
        />
      ))}
    </div>
  );
};

export default StarRating;
