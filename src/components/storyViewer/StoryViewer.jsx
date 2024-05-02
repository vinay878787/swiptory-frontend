import React, { useEffect, useState } from "react";
import { useCustomContext } from "../../context/Context";
import {
  getStoryById,
  addLikeToStory,
  unLikeStory,
  userData,
  addBookmark,
} from "../../api/Story";
import Loader from "../loader/Loader";
import prevBtn from "/prev.png";
import nextBtn from "/next2.png";
import closeBtn from "/closeInView.png";
import shareBtn from "/share.png";
import bookmarkImg from "/bookmark.png";
import unBookmarkImg from "/unbookmark.png";
import unlikeImg from "/unlike.png";
import likeImg from "/like.png";
import { userId } from "../../utils/constants/constant";
import { useNavigate } from "react-router-dom";
import styles from "./StoryViewer.module.css";

const StoryViewer = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    setIsLoading,
    storyIdForStatus,
    storyViewer,
    setStoryViewer,
    setLoginModalVisible,
    setIsModalVisible,
  } = useCustomContext();

  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState([]);
  const [user, setUser] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClose = () => {
    setStoryViewer(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await userData();
        if (response) {
          console.log("user data :", response);
          setUser(response);
        } else {
          console.log("User not logged in");
          navigate("/");
          setTimeout(() => {
            setStoryViewer(false);
            setIsModalVisible(true);
            setLoginModalVisible(true);
          }, 2500);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setIsLoading, storyIdForStatus]);

  useEffect(() => {
    const getStatusById = async (storyId) => {
      try {
        setIsLoading(true);
        const response = await getStoryById(storyId);
        if (response && response.data) {
          setSlides(response.data.slides);
          setLikeCount(response.data.likes);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (storyIdForStatus) {
      getStatusById(storyIdForStatus);
    } else {
      console.log("No story id for status available");
    }
  }, [storyIdForStatus, setIsLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex < slides.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  const handleLike = async (storyId) => {
    try {
      if (userId) {
        const response = await addLikeToStory(storyId);
        console.log("res like", response);

        if (response && response.data) {
          const updatedLikes = response.data.message || [];
          setLikeCount(updatedLikes);
          let isLiked = response.data.message.includes(userId);
          console.log("IS LIKED", isLiked);
          setIsLikedByUser(isLiked);
          setIsDataLoaded(true);

          console.log("like count", likeCount);
        }
      } else {
        console.log("User not logged in");
        setTimeout(() => {
          setStoryViewer(false);
          setIsModalVisible(true);
          setLoginModalVisible(true);
        }, 2500);
        navigate("/");
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleUnlike = async (storyId) => {
    try {
      const response = await unLikeStory(storyId);
      console.log("res like", response);
      if (response && response.data) {
        const updatedLikes = response.data.message || [];
        setLikeCount(updatedLikes);
        let isUnliked = response.data.message.includes(userId);
        console.log("IS UNLIKED", isUnliked);
        setIsLikedByUser(isUnliked);
        setIsDataLoaded(true);

        console.log("like count", likeCount);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  useEffect(() => {
    const isLiked = likeCount.includes(userId);
    setIsLikedByUser(isLiked);
    console.log(isLiked);
  }, [likeCount]);

  useEffect(() => {
    if (user && user.user && user.user.bookmarks && storyIdForStatus) {
      const bookmarkExists = user.user.bookmarks.some(
        (bookmark) => bookmark.storyId === storyIdForStatus
      );
      setIsBookmarked(bookmarkExists);
    }
  }, [user, storyIdForStatus, isBookmarked]);

  const handleAddBookmark = async (storyId) => {
    try {
      if (user) {
        const response = await addBookmark(storyId);
        console.log("response for user", response);
        if (response.status === 200) {
          if (user && user.user && user.user.bookmarks && storyIdForStatus) {
            const bookmarkExists = user.user.bookmarks.some(
              (bookmark) => bookmark.storyId === storyIdForStatus
            );
            setIsBookmarked(bookmarkExists);
          }
        } else {
          console.log("bookmark not added");

          if (user && user.user && user.user.bookmarks && storyIdForStatus) {
            const bookmarkExists = user.user.bookmarks.some(
              (bookmark) => bookmark.storyId === storyIdForStatus
            );
            setIsBookmarked(bookmarkExists);
          }
        }
      } else {
        console.log("User not logged in");
        navigate("/");
        setTimeout(() => {
          setStoryViewer(false);
          setIsModalVisible(true);
          setLoginModalVisible(true);
        }, 2500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return storyViewer ? (
    <div className={styles.overlayContainer}>
      <img
        className={styles.nextBtn}
        src={prevBtn}
        alt="Previous"
        onClick={() =>
          setCurrentSlideIndex((prev) =>
            prev > 0 ? prev - 1 : slides.length - 1
          )
        }
      />
      <div className={styles.statusContainer}>
        {isLoading || !isDataLoaded ? (
          <Loader />
        ) : (
          <div className={styles.slide}>
            <div className={styles.firstContainer}>
              <div className={styles.closeImg}>
                <img src={closeBtn} alt="close button" onClick={handleClose} />
              </div>
              <div className={styles.shareImg}>
                <img src={shareBtn} alt="share button" />
              </div>
            </div>
            <img
              src={slides[currentSlideIndex].imageUrl}
              alt="Slide"
              className={styles.images}
            />
            <div className={styles.slideContent}>
              <h3>{slides[currentSlideIndex].heading}</h3>
              <p>{slides[currentSlideIndex].description}</p>
            </div>
          </div>
        )}
        <div className={styles.reactions}>
          <div className={styles.bookmarkContainer}>
            {isBookmarked ? (
              <img
                src={unBookmarkImg}
                alt="unBookmark image"
                onClick={() => handleUnbookmark(storyIdForStatus)}
              />
            ) : (
              <img
                src={bookmarkImg}
                alt="bookmark image"
                onClick={() => handleAddBookmark(storyIdForStatus)}
              />
            )}
          </div>
          <div className={styles.likeContainer}>
            {isLikedByUser ? (
              <img
                src={unlikeImg}
                alt="unlike image"
                onClick={() => handleUnlike(storyIdForStatus)}
              />
            ) : (
              <img
                src={likeImg}
                alt="like image"
                onClick={() => handleLike(storyIdForStatus)}
              />
            )}
            <div className={styles.likeCount}>{likeCount.length}</div>
          </div>
        </div>
      </div>
      <img
        src={nextBtn}
        className={styles.prevBtn}
        alt="Next"
        onClick={() =>
          setCurrentSlideIndex((prev) =>
            prev < slides.length - 1 ? prev + 1 : 0
          )
        }
      />
    </div>
  ) : null;
};

export default StoryViewer;
