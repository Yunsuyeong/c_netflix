import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 72px;
  width: 50%;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider1 = styled.div`
  position: relative;
  top: -100px;
`;

const Slider2 = styled.div`
  position: relative;
  top: -350px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
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
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 48px;
  padding: 20px;
`;

const BigOverview = styled.p`
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
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
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const total = data.results.length - 1;
      const maxIndex = Math.floor(total / number) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
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
  console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          {/* <Slider2>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(number * index, number * index + number)
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
          </Slider2> */}
          <Slider1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(number * index, number * index + number)
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
                      <BigOverview>{clickedMovie.overview}</BigOverview>
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
