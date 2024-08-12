import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import axios from "axios";
import { api } from "../constant";
import defaultImage from "../img/profile_placeholder.jpg"
const Container = styled.div`
  /* min-width: 200px; */
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const CancelButton = styled.div`
  padding: 3px;
  background-color: transparent;
  border-radius: 5em;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`;

const CommentButton = styled.div`
  margin-left: 10px;
  padding: 7px 12px;
  background-color: #065fd4;
  border-radius: 5em;
  color: white;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`;

const BottomGap = styled.div`
  height: 100px;
  display: ${(props) => props.visible ? "flex" : "none"};
`;

const ShowMoreButton = styled.div`
  margin: 10px 0;
  padding: 7px 12px;
  background-color: ${({ theme }) => theme.soft};
  border-radius: 5em;
  color: ${({ theme }) => theme.text};
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.softHover};
  }
`;

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${api}/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [videoId]);

  const OnCancel = () => {
    const input = document.getElementById("newComment");
    setNewComment("");
    input.value = "";
    input.focus(false);
  };

  const OnComment = async () => {
    if(!currentUser) return;
    const res = await axios.post(
      `${api}/comments/`,
      {
        desc: newComment,
        userId: currentUser._id,
        videoId: videoId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setComments([...comments, res.data]);
    OnCancel();
  };

  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);
  
    useEffect(() => {
      const mediaQueryList = window.matchMedia(query);
  
      const listener = (event) => setMatches(event.matches);
      mediaQueryList.addEventListener("change", listener);
  
      return () => mediaQueryList.removeEventListener("change", listener);
    }, [query]);
  
    return matches;
  };

  const isLargeScreen = useMediaQuery("(min-width: 1200px)");

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser? currentUser.img : defaultImage} />
        <Input
          id="newComment"
          placeholder="Add a comment..."
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
        />
      </NewComment>
      {newComment.trim().length > 0 && (
        <Row>
          <CancelButton onClick={OnCancel}>Cancel</CancelButton>
          <CommentButton onClick={OnComment}>Comment</CommentButton>
        </Row>
      )}
      {comments.slice(0, showAllComments || isLargeScreen ? comments.length : 1).map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
      {comments.length > 1 && !isLargeScreen && (
        <ShowMoreButton onClick={() => setShowAllComments(!showAllComments)}>
          {showAllComments ? "See Less Comments" : "See All Comments"}
        </ShowMoreButton>
      )}
      <BottomGap visible={isLargeScreen}/>
    </Container>
  );
};

export default Comments;
