import React from "react";
import "./Home.scss";
import {Link} from 'react-router-dom';

import homeVideo from "../videos/indexvideo.mp4";
import logo from "../images/logo.png"
import homeSecurity from "../images/homeGoal.jpeg";
import homePoverty from "../images/homePoverty.jpg";
import homeCreativity from "../images/homeCreativity.jpg";

export default function Home() {
  return (
    <div>
      <div className="homeIndex">
        <video autoPlay loop muted>
          <source src={homeVideo} type='video/mp4'/>
        </video>
        <div className="title">
          <h3>CHANGE THE FUTURE</h3>
          <p>
            Growing up in poverty, children face tough challenges: hunger and malnutrition, limited access to education
            and medical services, social discrimination and isolation. But with support from people like you, we can
            help children get the health care, education, life skills, job-readiness training and confidence they need
            to create lasting change in their lives and communities. Together, we can end poverty for good.
          </p>

          <Link to='./Explore'>
            <button>Donate</button>
          </Link>

          <Link to='./Contact'>
            <button className="reachus">Reach Us</button>
          </Link>

        </div>
      </div>
      <div className="home2">
        <img src={logo} alt=""/>
        <div className="widget">
          <h3>Why Crpyto?</h3>
          <span>
            Donating cryptocurrency directly is more tax efficient and can save you money. 
            The IRS (Internal Revenue Service) classifies cryptocurrency as property for tax purposes which means it is 
            typically the most tax efficient way to support your favorite cause. 
            When donating crypto, you receive a tax deduction for the fair market 
            value of the crypto, and you avoid the capital gains tax you would 
            have incurred if you had sold the crypto and then made a donation. 
            That means you’re able to donate more, as well as deduct more on your tax return. 
            The difference? Sometimes more than 30%.
          </span>
        </div>
      </div>
      <div className="wrapper">
        <h2> Our Goal </h2>
        <div className="cards">
          <div id="one" className="box">
            <h3>Decentralization</h3>
            <img src={homeSecurity} alt="security"/>
            <h4>
              The donation serves as a contract between donor and charity, which is immutable,
              but requires funds to be pledged up-front by the donor.
              This blockchain-based website allows users to donate money directly to
              charitable causes with a number of conditions attached upheld with the
              use of smart contracts.
            </h4>
          </div>
          <div id="two" className="box">
            <h3>Fighting Poverty</h3>
            <img src={homePoverty} alt="security"/>
            <h4>
              Over the last 30 years over 1 billion people have come out of poverty.
              736 million people are still in extreme poverty - surviving on less than $1.90 a day.
              We tackle the underlying causes of poverty and social injustice,
              in order to deliver lasting change in the lives of poor and vulnerable people.
            </h4>
          </div>
          <div id="two" className="box">
            <h3>Inspiring Creativity</h3>
            <img src={homeCreativity} alt="security"/>
            <h4>
              All children need to be truly creative is the freedom to commit themselves completely
              to the effort and make whatever activity they are doing their own.
              Creativity also fosters mental growth in children by providing opportunities
              for trying out new ideas, and new ways of thinking and problem-solving.
            </h4>
          </div>
        </div>
      </div>
      <footer>
        <div>
          <h6>About</h6>
          <p className="text-justify">Support Children is a project created by Petar Radojević, Ivan Džambasanović and
            Branko Grbić as a part of web3.0 project for donation services.</p>
        </div>
        <div>
          <h6>Quick Links</h6>
          <ul className="footer-links">
            <li><Link to="/Explore">Explore</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
          </ul>
        </div>
        <div>Copyright© {new Date().getFullYear()} All Rights Reserved by Support Children</div>
      </footer>
    </div>
  );
}
