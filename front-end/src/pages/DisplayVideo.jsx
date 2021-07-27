import React from "react";
import Video1 from "../videos/index_video_1.mp4";
import "./DisplayVideo.scss"

class DisplayVideo extends React.Component {
  render() {
    return (
      <video className={"index_video"} autoPlay loop muted>
        <source src={Video1} type='video/mp4'/>
      </video>
    );
  }
}

export default DisplayVideo;