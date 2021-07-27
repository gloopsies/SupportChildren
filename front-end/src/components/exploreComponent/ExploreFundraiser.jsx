import React, {useState} from "react";
import {DateTime, Interval} from "luxon";

import Modal from './ExploreModal';
import './exploreFundraiser.scss';

export default function Fundraiser(props) {
  let {name, image, raisedAmount, goal, end_date, category} = props.fundraiser;
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(prev => !prev);
  }

  const end = DateTime.fromISO(end_date);
  const today = DateTime.now();
  const i = Interval.fromDateTimes(today, end);

  return (
    <div className="fundraiser">
      <button onClick={openModal}>
        <h1>{name}</h1>
        <img
          src={`${process.env["REACT_APP_BACKEND_ADDRESS"]}/images/${image}`}
          alt={name}
        />
        <h4>
          {category === 0 ? "Health" :
            category === 1 ? "Education" :
              category === 2 ? "Empowerment" :
                category === 3 ? "Employment" :
                  category === 4 ? "Arts and Culture" :
                    category === 5 ? "Human and Civil Rights" : "Religion"}
        </h4>
        <svg width="200" height="10">
          <rect width="200" height="20" fill="lightblue" rx="0" ry="0"/>
          <rect width={2 * Math.floor((raisedAmount * 100) / goal)} height=" 10" fill="darkblue" rx="0" ry="0"/>
        </svg>
        <h3>{+raisedAmount} / {goal} ETH</h3>
        <h3>{i.length('days').toFixed(0)} days left</h3>
      </button>

      <Modal showModal={showModal} setShowModal={setShowModal} fundraiser={props.fundraiser}/>
    </div>
  )
}
