import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  getRatedMovies,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 150vh;
  display: flex;
  flex-direction: column;
  padding: 120px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 72px;
  width: 75%;

  @media screen and (max-width: 640px) {
    font-size: 36px;
    width: 100%;
  }
`;

const Overview = styled.p`
  font-size: 36px;
  width: 75%;

  @media screen and (max-width: 640px) {
    font-size: 18px;
    width: 100%;
  }
`;

const Slider1 = styled.div`
  position: relative;
  top: -100px;

  @media screen and (max-width: 640px) {
    top: 270px;
  }
`;

const Slider2 = styled.div`
  position: relative;
  top: -330px;

  @media screen and (max-width: 640px) {
    top: -190px;
  }
`;

const Slider3 = styled.div`
  position: relative;
  top: -560px;

  @media screen and (max-width: 640px) {
    top: -650px;
  }
`;

const SliderCon = styled.div`
  display: flex;
  align-items: center;
`;

const SliderTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  padding: 10px 5px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 10px;

  @media screen and (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: white;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 20px;

    @media screen and (max-width: 640px) {
      font-size: 16px;
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Bigbox = styled(motion.div)`
  position: absolute;
  background-color: ${(props) => props.theme.black.lighter};
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;

  @media screen and (max-width: 640px) {
    width: 60vw;
  }
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;

  @media screen and (max-width: 640px) {
    height: 300px;
  }
`;

const BigTitle = styled.h3`
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  padding: 20px;

  @media screen and (max-width: 640px) {
    font-size: 24px;
  }
`;

const BigOverview = styled.p`
  position: relative;
  top: -100px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 16px;
  padding: 20px;

  @media screen and (max-width: 640px) {
    font-size: 12px;
  }
`;

const Bigdate = styled.p`
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  padding: 20px;

  @media screen and (max-width: 640px) {
    font-size: 16px;
  }
`;

const Bigscore = styled.p`
  position: relative;
  top: -120px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 16px;
  padding: 20px;

  @media screen and (max-width: 640px) {
    font-size: 12px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxvariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -50,
    scale: 1.3,
    transition: { delay: 0.2, duration: 0.5, type: "tween" },
  },
};

const infoVariant = {
  hover: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.5, type: "tween" },
  },
};

const number = 6;

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { isLoading: isLoading2, data: popularData } =
    useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
  const { isLoading: isLoading3, data: ratedData } = useQuery<IGetMoviesResult>(
    ["movies", "coming"],
    getRatedMovies
  );
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [leaving1, setLeaving1] = useState(false);
  const [leaving2, setLeaving2] = useState(false);
  const [leaving3, setLeaving3] = useState(false);
  const increaseIndex1 = () => {
    if (data) {
      if (leaving1) return;
      toggleLeaving1();
      const total = data.results.length - 1;
      const maxIndex = Math.floor(total / number) - 1;
      setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex2 = () => {
    if (popularData) {
      if (leaving2) return;
      toggleLeaving2();
      const total = popularData.results.length - 1;
      const maxIndex = Math.floor(total / number) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex3 = () => {
    if (ratedData) {
      if (leaving3) return;
      toggleLeaving3();
      const total = ratedData.results.length - 1;
      const maxIndex = Math.floor(total / number) - 1;
      setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving1 = () => setLeaving1((prev) => !prev);
  const toggleLeaving2 = () => setLeaving2((prev) => !prev);
  const toggleLeaving3 = () => setLeaving3((prev) => !prev);
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate(`/`);
  };
  const clickedMovie =
    movieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );
  const clickedPopularMovie =
    movieMatch?.params.movieId &&
    popularData?.results.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );
  const clickedRatedMovie =
    movieMatch?.params.movieId &&
    ratedData?.results.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider3>
            <SliderCon onClick={increaseIndex3}>
              <SliderTitle>Top Rated</SliderTitle>
            </SliderCon>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving3}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index3}
              >
                {ratedData?.results
                  .slice(1)
                  .slice(number * index3, number * index3 + number)
                  .map((movie) => (
                    <Box
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxvariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      onClick={() => onBoxClick(movie.id)}
                    >
                      <Info variants={infoVariant}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider3>
          <Slider2>
            <SliderCon onClick={increaseIndex2}>
              <SliderTitle>Popular</SliderTitle>
            </SliderCon>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving2}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index2}
              >
                {popularData?.results
                  .slice(1)
                  .slice(number * index2, number * index2 + number)
                  .map((movie) => (
                    <Box
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxvariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      onClick={() => onBoxClick(movie.id)}
                    >
                      <Info variants={infoVariant}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider2>
          <Slider1>
            <SliderCon onClick={increaseIndex1}>
              <SliderTitle>Now Playing</SliderTitle>
            </SliderCon>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving1}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index1}
              >
                {data?.results
                  .slice(1)
                  .slice(number * index1, number * index1 + number)
                  .map((movie) => (
                    <Box
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxvariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      onClick={() => onBoxClick(movie.id)}
                    >
                      <Info variants={infoVariant}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider1>
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Bigbox
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={movieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <Bigdate>
                        Release Date : {clickedMovie?.release_date}
                      </Bigdate>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                      <Bigscore>Score : {clickedMovie?.vote_average}</Bigscore>
                    </>
                  )}
                  {clickedPopularMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedPopularMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedPopularMovie.title}</BigTitle>
                      <Bigdate>
                        Release Date : {clickedPopularMovie?.release_date}
                      </Bigdate>
                      <BigOverview>{clickedPopularMovie.overview}</BigOverview>
                      <Bigscore>
                        Score : {clickedPopularMovie?.vote_average}
                      </Bigscore>
                    </>
                  )}
                  {clickedRatedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedRatedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedRatedMovie.title}</BigTitle>
                      <Bigdate>
                        Release Date : {clickedRatedMovie?.release_date}
                      </Bigdate>
                      <BigOverview>{clickedRatedMovie.overview}</BigOverview>
                      <Bigscore>
                        Score : {clickedRatedMovie?.vote_average}
                      </Bigscore>
                    </>
                  )}
                </Bigbox>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
