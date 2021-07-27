import React from 'react'
import './ExploreSidebar.scss'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function Sidebar({filter, setFilter}) {
  const handleOption = (event) => setFilter({option: event.target.value});
  const handleRotate = () => setFilter({dir: !filter.dir});

  const handleStartDate = (event) => setFilter({start_date: event.target.value + "T00:00:00Z"});
  const handleEndDate = (event) => setFilter({end_date: event.target.value + "T00:00:00Z"});

  const handleStartPrice = (event) => setFilter({start_price: event.target.value});
  const handleEndPrice = (event) => setFilter({end_price: event.target.value});


  const handleCheckbox = (cat) => {
    let category = [...filter.category];
    if (category.includes(cat)) {
      category = category.filter(e => e !== cat);
    } else {
      category.push(cat);
    }
    setFilter({category});
  }
  console.log(filter.health);
  return (
    <div className="exploreSidebar">
      <h3 className="exploreSidebarTitle">Filter</h3>

      <h4>Sort by</h4>
      <div className="component">
        <div className="sort">
          <select
            defaultValue="0"
            id="category"
            name="category"
            onClick={handleOption}
          >
            <option value="0">Date Created</option>
            <option value="1">Expiring Date</option>
            <option value="2">Goal Price</option>
            <option value="3">Price Left</option>
            <option value="4">Price Collected</option>
          </select>
          <ArrowDownwardIcon className={`arrow ${filter.dir ? "rotate" : ""}`} onClick={handleRotate}/>
        </div>
      </div>
      <div className="component">
        <h4>Choose Category</h4>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.health}
              onChange={() => handleCheckbox(0)}
            />
            Health
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.education}
              onChange={() => handleCheckbox(1)}
            />
            Education
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.empowerment}
              onChange={() => handleCheckbox(2)}
            />
            Empowerment
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.employment}
              onChange={() => handleCheckbox(3)}
            />Employment
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.arts}
              onChange={() => handleCheckbox(4)}
            />
            Arts and Culture
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.rights}
              onChange={() => handleCheckbox(5)}
            />
            Human / Civil Rights
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              defaultChecked={filter.religion}
              onChange={() => handleCheckbox(6)}
            />
            Religion
          </label>
        </div>
      </div>

      <div className="dategoal">
        <h4>Select Date</h4>
        <label>From</label>
        <input
          name="start_date"
          placeholder="Date"
          type="date"
          onChange={handleStartDate}
        />
        <label>To</label>
        <input
          name="end_date"
          placeholder="Date"
          type="date"
          onChange={handleEndDate}
        />

      </div>

      <div className="dategoal">
        <h4>Select Goal Range</h4>
        <label>From</label>
        <input
          name="start_goal"
          placeholder="Min. Price"
          type="number"
          min="0"
          max="1e9"
          step=".00001"
          onChange={handleStartPrice}
        />
        <label>To</label>
        <input
          name="end_goal"
          placeholder="Max. Price"
          type="number"
          min="0"
          max="1e9"
          step=".00001"
          onChange={handleEndPrice}
        />
      </div>
      <label></label>
    </div>
  )
}