import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router";

function BookShow() {
  const totalSeats = [];
  const [seats, setSeats] = useState(totalSeats);
  const [date, setDate] = useState("");

  const location = useLocation();
  console.log(location.state.movie);
  const matrix = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => null)
  );

  /**
   * @desc Function to get seat number
   */
  const getSeatNumber = (row, column) => {
    setSeats((prevArray) => [...prevArray, row + column]);
  };

  /**
   * @desc Confirm booking
   */
  const confirmBookng = async () => {
    const booking = {
      name: location.state.movie.name,
      seats: seats,
      from: location.state.movie.from,
      to: location.state.movie.to,
      runTime: location.state.movie.runTime,
      theaterId: location.state.movie.theaterId,
      theaterName: location.state.movie.theaterName,
      date: date,
    };

    try {
      const url = process.env.REACT_APP_API_URL + "/theaters/book";

      if (JSON.parse(localStorage.getItem("bookmyseat_user"))) {
        const response = await axios.post(url, booking, {
          headers: {
            Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("bookmyseat_user")).token,
          },
        });

        console.log("Booking response:", response.data);
      }
    } catch (err) {}
  };

  return (
    <div style={{ marginTop: "5rem" }} className="container">
      {/* Wrapper for screen and seat */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ overflow: "scroll" }}
      >
        <div
          style={{
            width: "50rem",
            height: "0.7rem",
            backgroundColor: "lightgray",
            borderRadius: "1rem",
          }}
        ></div>
        <div className="mb-3 fw-bold fs-4">Psst...screen is over here!</div>
        <table>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    style={{ cursor: "pointer" }}
                    className="p-2"
                  >
                    <div
                      style={{
                        height: "2.5rem",
                        width: "2.5rem",
                        backgroundColor: "#3d8f80",
                        borderRadius: "0.2rem",
                        textAlign: "center",
                        color: "azure",
                        fontWeight: "600",
                      }}
                      onClick={() =>
                        getSeatNumber(
                          String.fromCharCode(rowIndex + 65),
                          columnIndex + 1
                        )
                      }
                    >
                      {String.fromCharCode(rowIndex + 65)} {columnIndex + 1}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Show details */}
      <div className="d-flex flex-column align-items-center my-5">
        <div className="mb-1">
          <b>Movie</b>: {location.state.movie.name}
        </div>
        <div className="mb-1">
          <b>Theater</b>: {location.state.movie.theaterName}
        </div>
        <div className="mb-1">
          <b>Show time</b>: {location.state.movie.from}
        </div>
        <div className="mb-1">
          <b>Your seats</b>:{" "}
          {seats.map((seat) => {
            return <span>{seat}&nbsp;</span>;
          })}
        </div>
        <input
          type="date"
          style={{ width: "11rem" }}
          className="form-control mb-3"
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn btn-danger" onClick={confirmBookng}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookShow;
