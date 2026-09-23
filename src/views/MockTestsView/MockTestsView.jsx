import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ScoreChart from '../../components/ScoreChart/ScoreChart.jsx';
import { istTodayIso } from '../../utils/ist.js';

const TEST_TYPES = ['Full Mock', 'Subject Test', 'Weekly Quiz', 'PYQ Paper'];

export default function MockTestsView() {
  const { state, dispatch } = useApp();
  const [date, setDate] = useState(istTodayIso());
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [max, setMax] = useState('100');
  const [testType, setTestType] = useState(TEST_TYPES[0]);

  function handleAdd() {
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum)) { alert('Enter a score.'); return; }
    dispatch({
      type: 'ADD_TEST',
      payload: { date, name: name.trim() || 'Untitled test', score: scoreNum, max: parseFloat(max) || 100, testType }
    });
    setName('');
    setScore('');
  }

  // Sort chronological for chart, reversed for table
  const sorted = [...state.tests].sort((a, b) => new Date(a.date) - new Date(b.date));
  const tableRows = [...sorted].reverse();

  return (
    <div className="sheet">
      <h2 className="section-title">Mock Test Tracker</h2>
      <p className="section-note">
        Log every weekly quiz, test series paper, or full mock. Score is out of 100 unless you change the max.
      </p>

      <div className="test-form">
        <label>
          Date
          <input type="date" id="tDate" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Test name
          <input type="text" id="tName" placeholder="e.g. Test Series 4" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Score
          <input type="number" id="tScore" placeholder="62" value={score} onChange={e => setScore(e.target.value)} />
        </label>
        <label>
          Max marks
          <input type="number" id="tMax" placeholder="100" value={max} onChange={e => setMax(e.target.value)} />
        </label>
        <label>
          Type
          <select id="tType" value={testType} onChange={e => setTestType(e.target.value)}>
            {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <button className="btn" id="addTestBtn" onClick={handleAdd}>Log test</button>
      </div>

      <ScoreChart tests={sorted} />

      <div className="table-scroll">
        <table className="tests">
          <thead>
            <tr>
              <th>Date</th><th>Test</th><th>Type</th><th>Score</th><th>%</th><th></th>
            </tr>
          </thead>
          <tbody id="testsBody">
            {tableRows.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.name}</td>
                <td>{t.testType}</td>
                <td>{t.score}/{t.max}</td>
                <td>{Math.round((t.score / t.max) * 100)}%</td>
                <td>
                  <span
                    className="del-x"
                    data-id={t.id}
                    onClick={() => {
                      if (window.confirm('Delete this mock test?')) {
                        dispatch({ type: 'DELETE_TEST', payload: { id: t.id } });
                      }
                    }}
                  >✕</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
