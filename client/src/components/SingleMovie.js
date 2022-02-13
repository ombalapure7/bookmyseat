import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const url = process.env.REACT_APP_API_URL + "/movies";

function SingleMovie() {
  const navigate = useNavigate();

  const [movie, setMovie] = useState({});
  const [shows, setShows] = useState([]);
  const [btnClicked, setBtnClicked] = useState(false);
  const [warning, setWarning] = useState("");
  const { id } = useParams();

  /**
   * @desc Get movie details
   */
  const getMovie = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/${id}`);
      setMovie(response.data.movie);
      setWarning("");
    } catch (err) {
      setWarning("Something went wrong while fetching the movie details...");
    }
  }, [id]);

  useEffect(() => {
    getMovie();
  }, [getMovie]);

  /**
   * @desc Get booking details
   */
  const getMovieShowTimings = async (movieName) => {
    setBtnClicked(true);

    try {
      const response = await axios.get(`${url}/timings/${movieName}`);
      setShows(response.data.movies);
      setWarning("");
    } catch (err) {
      setWarning("Something went wrong while fetching the movie details...");
    }
  };

  /**
   * @desc Add a movie
   */
  const bookShow = (theaterId, theaterName, city) => {
    navigate(
      "/book",
      {
        state: {
          movie,
        },
      },
      { replace: true }
    );
  };

  return (
    <div className="container mb-4" style={{ marginTop: "5rem" }}>
      <div className="card" style={{ backgroundColor: "#dae7ed" }}>
        <div className="card-body d-flex justify-content-center flex-wrap align-items-center">
          <div style={{ width: "19rem" }}>
            <img src={movie.image} alt={movie.name} className="w-100" />
          </div>
          <div
            className="p-5 d-flex flex-column"
            style={{ fontSize: "1.2rem" }}
          >
            <div>
              <div className="fs-2 fw-bold">{movie.name}</div>
              <hr />
            </div>
            <p>
              <b>Rating</b>: {movie.pgRating}
            </p>
            <p>
              <b>Release Date</b>: {movie.releaseDate}
            </p>
            <p>
              <b>Runtime</b>: <i>{(movie.runtime / 60).toFixed(2)}hrs</i>
            </p>
            <p>
              <b>Genre</b>: {movie.genre}
            </p>
            <button
              className="btn btn-danger"
              onClick={() => getMovieShowTimings(movie.name)}
            >
              Book Show
            </button>
          </div>
        </div>
      </div>
      {warning ? (
        <p
          className="d-flex justify-content-center alert alert-danger"
          role="alert"
        >
          {warning}
        </p>
      ) : null}
      {btnClicked ? (
        <div className="container mt-5">
          <p className="fs-4" style={{ fontWeight: "700" }}>
            Show Timings for "<span className="text-primary">{movie.name}</span>
            "
          </p>
          <hr />
          {shows.map((show) => {
            return (
              <div key={show._id} className="card m-4 p-3">
                <div className="d-flex justify-content-between flex-wrap">
                  <p className="fs-5">
                    <b>{show.theaterName}</b>
                  </p>
                  <button
                    className="btn btn btn-outline-success"
                    onClick={bookShow}
                  >
                    {show.from}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default SingleMovie;
