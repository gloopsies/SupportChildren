import React from 'react';
import './FeaturedInfo.scss';

import {ArrowDownward, ArrowUpward} from '@material-ui/icons';

export default function FeaturedInfo({transactionss, sizee}) {
  let day = 0.0, prev_day = 0.0, week = 0.0, prev_week = 0.0, month = 0.0, prev_month = 0.0;

  function parseDate(str) {
    var mdy = str.split('-');
    return new Date(mdy[0], mdy[1]-1, mdy[2]);
  }
  function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
  }

  for (let i = 0; i < sizee; i++) {
    console.log(transactionss[i].value, parseFloat(transactionss[i].value));
    for (var j = 0; j < transactionss[i].value.length; j++) {
      if (transactionss[i].value[j] == '.' && transactionss[i].value[j+1] == '.'){
        transactionss[i].value = transactionss[i].value.slice(0, j) + transactionss[i].value.slice(j+1);
        break;
      }
    }
    transactionss[i].value = parseFloat(transactionss[i].value);
    var a = transactionss[i].created_at;
    var today = new Date();
    var b = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();

    var diff = datediff(parseDate(a), parseDate(b));

    // day
    if (diff == 0) {
      day += transactionss[i].value;
      //day = day.toPrecision(3);
    }
    else if (diff == 1) {
      prev_day += transactionss[i].value;
      //prev_day = prev_day.toPrecision(3);
    }

    // week
    if (diff < 7) {
      week += transactionss[i].value;
      //week = week.toPrecision(3);
    }
    else if (diff < 14) {
      prev_week += transactionss[i].value;
      //prev_week = prev_week.toPrecision(3);
    }

    // month
    if (diff < 30) {
      month += transactionss[i].value;
    }
    else if (diff < 60) {
      prev_month += transactionss[i].value;
    }
  }

  return (
    <div className="adminFeatured">
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Monthly Revenue</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">{month} ETH</span>
        </div>
          <span className="adminFeaturedMoneyRate">
            Last Month: 
            {month > prev_month ? '  +' : '  -'} {month - prev_month}
            {month > prev_month ? <ArrowUpward className="adminFeaturedIcon"/> 
            : <ArrowDownward className="adminFeaturedIcon negative"/>}
          </span>
      </div>
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Weekly Revenue</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">
            {week} ETH
          </span>
        </div>
          <span className="adminFeaturedMoneyRate">
            Last week:
            {week > prev_week ? '  +' : '  -'} {week - prev_week}
            {week > prev_week ? <ArrowUpward className="adminFeaturedIcon"/> 
            : <ArrowDownward className="adminFeaturedIcon negative"/>}
          </span>
      </div>
      <div className="adminFeaturedItem">
        <span className="adminFeaturedTitle">Daily Revenue</span>
        <div className="adminFeaturedMoneyContainer">
          <span className="adminFeaturedMoney">
            {day} ETH
          </span>
        </div>
          <span className="adminFeaturedMoneyRate">
            Yesterday:
            {day > prev_day ? '  +' : '  -'} {day - prev_day}
            {day > prev_day ? <ArrowUpward className="adminFeaturedIcon"/> 
            : <ArrowDownward className="adminFeaturedIcon negative"/>}
          </span>
      </div>
    </div>
  )
}
