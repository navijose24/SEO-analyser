import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function getColor(status) {
  if (!status.present) return '#fff'; // white
  if (status.bestPractice === false) return '#eee'; // light gray
  return '#ddd'; // gray
}

function TagResult({ label, status }) {
  return (
    <div style={{ background: getColor(status), padding: 12, marginBottom: 8, borderRadius: 6, border: '1.5px solid #111', color: '#111' }}>
      <strong>{label}:</strong> {status.value ? <span>"{status.value}"</span> : <span style={{ color: '#111', fontStyle: 'italic' }}>Missing</span>}
      <div style={{ fontSize: 12, color: '#333' }}>{status.tip}</div>
      {status.length !== undefined && (
        <div style={{ fontSize: 12 }}>Length: {status.length}</div>
      )}
    </div>
  );
}

function ObjectTags({ label, tags }) {
  if (!tags || Object.keys(tags).length === 0) return null;
  const isOpenGraph = label.toLowerCase().includes('open graph');
  if (isOpenGraph) {
    return (
      <div style={{ marginBottom: 20, background: '#fafafa', border: '2px solid #111', borderRadius: 8, padding: 16, color: '#111' }}>
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, letterSpacing: 1, textAlign: 'center', borderBottom: '1.5px solid #111', paddingBottom: 6 }}>
          {label}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {Object.entries(tags).map(([k, v]) => (
            <div key={k} style={{ border: '1.5px solid #111', borderRadius: 6, background: '#fff', padding: '10px 16px', minWidth: 120, marginBottom: 6, boxShadow: '2px 2px 0 #000', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{k.replace(/^og:/, '')}</div>
              {k === 'og:image' && v ? (
                <img src={v} alt="og image" style={{ maxWidth: 100, maxHeight: 100, border: '1px solid #111', borderRadius: 4, boxShadow: '1px 1px 0 #000', background: '#fff', margin: '0 auto', display: 'block' }} />
              ) : (
                <div style={{ fontSize: 13, wordBreak: 'break-all' }}>{v}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Default for other tags
  if (label.toLowerCase().includes('twitter')) {
    return (
      <div style={{ marginBottom: 20, background: '#fafafa', border: '2px solid #111', borderRadius: 8, padding: 16, color: '#111' }}>
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, letterSpacing: 1, textAlign: 'center', borderBottom: '1.5px solid #111', paddingBottom: 6 }}>
          {label}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {Object.entries(tags).map(([k, v]) => (
            <div key={k} style={{ border: '1.5px solid #111', borderRadius: 6, background: '#fff', padding: '10px 16px', minWidth: 120, marginBottom: 6, boxShadow: '2px 2px 0 #000', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{k.replace(/^twitter:/, '')}</div>
              {k === 'twitter:image' && v ? (
                <img src={v} alt="twitter card" style={{ maxWidth: 100, maxHeight: 100, border: '1px solid #111', borderRadius: 4, boxShadow: '1px 1px 0 #000', background: '#fff', margin: '0 auto', display: 'block' }} />
              ) : (
                <div style={{ fontSize: 13, wordBreak: 'break-all' }}>{v}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 12, background: '#fafafa', border: '1.5px solid #111', borderRadius: 6, padding: 8, color: '#111' }}>
      <strong>{label}:</strong>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
        {Object.entries(tags).map(([k, v]) => (
          <div key={k} style={{ border: '1px solid #111', borderRadius: 4, padding: '4px 8px', background: '#fff', fontSize: 13 }}><b>{k}:</b> {v}</div>
        ))}
      </div>
    </div>
  );
}

// Helper to calculate SEO score
function calculateScore(result) {
  if (!result) return 0;
  let score = 0;
  let total = 4; // title, description, canonical, robots
  if (result.title.present) score += result.title.bestPractice ? 1 : 0.5;
  if (result.description.present) score += result.description.bestPractice ? 1 : 0.5;
  if (result.canonical.present) score += 1;
  if (result.robots.present) score += 1;
  // Scale to 100
  return Math.round((score / total) * 100);
}

function TechnicalDetails({ technical }) {
  if (!technical) return null;
  return (
    <div style={{ margin: '32px 0 20px 0', background: '#fff', border: '2px solid #111', borderRadius: 10, boxShadow: '0 0 0 4px #000', padding: 20, maxWidth: 600 }}>
      <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>⚙️</span> Technical Details
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ flex: '1 1 180px', minWidth: 140 }}>
          <div style={{ color: '#888', fontSize: 13 }}>Response Time</div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{technical.responseTime}ms</div>
        </div>
        <div style={{ flex: '1 1 180px', minWidth: 140 }}>
          <div style={{ color: '#888', fontSize: 13 }}>Page Size</div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{(technical.pageSize / 1024).toFixed(2)} KB</div>
        </div>
        <div style={{ flex: '1 1 180px', minWidth: 140 }}>
          <div style={{ color: '#888', fontSize: 13 }}>Images Found</div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{technical.imagesFound}</div>
        </div>
        <div style={{ flex: '1 1 180px', minWidth: 140 }}>
          <div style={{ color: '#888', fontSize: 13 }}>Links Found</div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{technical.linksFound}</div>
        </div>
        <div style={{ flex: '1 1 180px', minWidth: 140 }}>
          <div style={{ color: '#888', fontSize: 13 }}>HTTP Status</div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{technical.httpStatus}</div>
        </div>
        <div style={{ flex: '1 1 180px', minWidth: 140 }}>
          <div style={{ color: '#888', fontSize: 13 }}>SSL Certificate</div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>
            {technical.sslValid === null ? 'N/A' : technical.sslValid ? <span style={{ color: '#090' }}>Valid</span> : <span style={{ color: '#900' }}>Invalid</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post('http://localhost:4000/analyze', { url });
      setResult({
        ...res.data.analysis,
        technical: res.data.technical
      });
    } catch (err) {
      setError('Failed to analyze. Make sure the URL is correct and CORS is allowed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: '"Comic Sans MS", "Comic Sans", cursive, sans-serif', background: '#fff', color: '#111', border: '2px solid #111', borderRadius: 10, boxShadow: '0 0 0 4px #000', padding: 24 }}>
      <h1 style={{ color: '#000', textShadow: '2px 2px 0 #fff' }}>SEO Meta Tag Analyzer</h1>
      <form onSubmit={handleAnalyze} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g. https://example.com)"
          style={{ width: '80%', padding: 8, fontSize: 16, background: '#fff', color: '#111', border: '2px solid #111', borderRadius: 4 }}
          required
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: 8, fontSize: 16, background: '#fff', color: '#111', border: '2px solid #111', borderRadius: 4, boxShadow: '2px 2px 0 #000' }} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {result && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 'bold', letterSpacing: 2, color: '#111', border: '2px solid #111', borderRadius: 8, display: 'inline-block', padding: '8px 32px', background: '#fff', boxShadow: '2px 2px 0 #000' }}>
            SEO Score: {calculateScore(result)} / 100
          </div>
        </div>
      )}
      {error && <div style={{ color: '#000', background: '#fff', border: '1px solid #111', padding: 8, borderRadius: 4, marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <TagResult label="Title" status={result.title} />
          <TagResult label="Meta Description" status={result.description} />
          <TagResult label="Canonical" status={result.canonical} />
          <TagResult label="Robots" status={result.robots} />
          <ObjectTags label="Open Graph Tags" tags={result.openGraph} />
          <TechnicalDetails technical={result.technical} />
        </div>
      )}
      <footer style={{ marginTop: 40, fontSize: 13, color: '#111', borderTop: '1px solid #111', paddingTop: 12 }}>
        SEO Analyzer &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
