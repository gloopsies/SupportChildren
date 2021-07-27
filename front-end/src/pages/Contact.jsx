import React from "react";
import './Contact.scss';
import emailjs from 'emailjs-com';

import BGImage from '../images/contactimage.jpg'
//feedback - email, type, 
export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const category = document.getElementById('category').value;
    const statement = document.getElementById('statement').value;

    const emailChecker = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailChecker.test(String(email).toLowerCase()) || category === 0 || statement === '') {
      console.log("Make sure that the values are correct");
      return;
    }

    emailjs.sendForm('gmail', 'template_7yn2x7j', e.target, 'user_f9v5a7OxuGNLzjNfdKVP8')
      .then((result) => {
        console.log(result.text);
        window.location = "/Contact"
      }, (error) => {
        console.log(error.text);
      });


  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="contactIndex">
          <img src={BGImage} alt='bg'/>
          <div className="title">
            <h3>Contact Us</h3>
            <p> We care about you</p>

            <div className="contactItem">
              <label>E-mail *</label>
              <input
                id="email"
                name="email"
                placeholder="E-mail"
                type="text"
                required
              />
            </div>
            <div className="contactItem">
              <label>Select Type *</label>
              <select
                id="category"
                name="category"
                required
              >
                <option defaultValue='0' disabled hidden>Select Category</option>
                <option value="Question">Question</option>
                <option value="Complaint">Complaint</option>
                <option value="Advice">Advice</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="contactItem">
              <label>Statement *</label>
              <textarea
                id="statement"
                name="statement"
                placeholder="Write your statement here"
                rows="4"
                required
              />
            </div>
            <input className="button" type="submit" value="Send"/>
          </div>
        </div>
      </form>
    </div>
  );
}