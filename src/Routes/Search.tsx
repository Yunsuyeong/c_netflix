import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getSearchMovie,
  getSearchPeople,
  getSearchTv,
  IGetMoviesResult,
  IGetPeopleResult,
  IGetTvsResult,
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 120px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Slider1 = styled.div`
  position: relative;
  top: -400px;
`;

const Slider2 = styled.div`
  position: relative;
  top: -650px;
`;

const SliderCon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  padding: 10px 50px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  position: absolute;
  width: 100%;
  padding: 10px 100px;

  @media screen and (max-width: 640px) {
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
      font-size: 12px;
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
    font-size: 20px;
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

const number = 3;

function Search() {
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const navigate = useNavigate();
  const movieMatch = useMatch("/search/:movieId");
  const tvMatch = useMatch("/search/:tvId");
  const { scrollY } = useScroll();
  const { isLoading, data: movieData } = useQuery<IGetMoviesResult>(
    ["search", "movie"],
    () => getSearchMovie(keyword!)
  );
  const { isLoading: isLoading2, data: tvData } = useQuery<IGetTvsResult>(
    ["search", "tv"],
    () => getSearchTv(keyword!)
  );
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [leaving1, setLeaving1] = useState(false);
  const [leaving2, setLeaving2] = useState(false);
  const increaseIndex1 = () => {
    if (movieData) {
      if (leaving1) return;
      toggleLeaving1();
      const total = movieData.results.length - 1;
      const maxIndex = Math.floor(total / number) - 1;
      setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseIndex2 = () => {
    if (tvData) {
      if (leaving2) return;
      toggleLeaving2();
      const total = tvData.results.length - 1;
      const maxIndex = Math.floor(total / number) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving1 = () => setLeaving1((prev) => !prev);
  const toggleLeaving2 = () => setLeaving2((prev) => !prev);
  const onMovieClick = (movieId: number) => {
    navigate(`/search/${movieId}`);
  };
  const onTvClick = (tvId: number) => {
    navigate(`/search/${tvId}`);
  };
  const onOverlayClick = () => {
    navigate(-1);
  };
  const clickedMovie =
    movieMatch?.params.movieId &&
    movieData?.results.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );
  const clickedTv =
    tvMatch?.params.tvId &&
    tvData?.results.find((tv) => String(tv.id) === tvMatch.params.tvId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner bgPhoto="" />
          <Slider2>
            <SliderCon onClick={increaseIndex2}>
              <SliderTitle>Tv</SliderTitle>
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
                {tvData?.results
                  .slice(1)
                  .slice(number * index2, number * index2 + number)
                  .map((tv) => (
                    <Box
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      variants={boxvariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      layoutId={tv.id + ""}
                      key={tv.id}
                      onClick={() => onTvClick(tv.id)}
                    >
                      <Info variants={infoVariant}>
                        <h4>
                          {tv.name} ({tv.original_name})
                        </h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider2>
          <Slider1>
            <SliderCon onClick={increaseIndex1}>
              <SliderTitle>Movie</SliderTitle>
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
                {movieData?.results
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
                      onClick={() => onMovieClick(movie.id)}
                    >
                      <Info variants={infoVariant}>
                        <h4>
                          {movie.title} ({movie.original_title})
                        </h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider1>
          <AnimatePresence>
            {tvMatch || movieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Bigbox
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={tvMatch?.params.tvId || movieMatch?.params.movieId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <Bigdate>
                        First Airing Date : {clickedTv?.first_air_date}
                      </Bigdate>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                      <Bigscore>Score : {clickedTv?.vote_average}</Bigscore>
                    </>
                  )}
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
                        Release Date: {clickedMovie?.release_date}
                      </Bigdate>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                      <Bigscore>Score : {clickedMovie?.vote_average}</Bigscore>
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

export default Search;
