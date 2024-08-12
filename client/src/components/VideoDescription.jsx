import { useState } from "react";
import styled from "styled-components";

const DescriptionContainer = styled.div`
  position: relative;
  overflow: hidden;
  max-height: ${({ expanded }) => (expanded ? "none" : "4em")};
  line-height: 1.4em;
`;

const DescriptionText = styled.p`
  font-size: 14px;
  margin: 0;
  ${({ expanded }) =>
    !expanded &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    line-height: 1.2em; /* Adjust line-height to control spacing */
    max-height: 2.4em; /* Should be 2 * line-height */
    word-break: break-word; /* Ensure long words break correctly */
  `}
`;

const ToggleButton = styled.span`
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-left: 5px;
  display: inline-block;
`;

const VideoDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <DescriptionContainer expanded={isExpanded}>
      <DescriptionText expanded={isExpanded}>
        {description}
      </DescriptionText>
      { description && description.length > 100 && (
        <ToggleButton onClick={toggleDescription}>
          {isExpanded ? "Show less" : "more"}
        </ToggleButton>
      )}
    </DescriptionContainer>
  );
};

export default VideoDescription;
