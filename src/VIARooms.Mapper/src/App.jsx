import React, { useState, useRef } from 'react';

const PercentageMapper = () => {
  const [maps, setMaps] = useState([
    { id: 1, name: 'Floor 3', src: '/floor3.jpg', rooms: [] },
    { id: 2, name: 'Floor 2', src: '/floor2.jpg', rooms: [] },
  ]);
  
  const [activeMapId, setActiveMapId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState({ x: 0, y: 0 });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', type: 'Classroom', status: 'vacant' });
  
  const imgRef = useRef(null);
  const roomTypes = ['Classroom', 'Group Room', 'Work Room', 'Lab', 'Office'];
  const activeMap = maps.find(m => m.id === activeMapId);

  // --- NEW: IMPORT LOGIC ---
  const handleJsonImport = (e) => {
    const file = e.target.files[0];
    if (!file || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        let importedData = JSON.parse(event.target.result);

        // MAP through the data and convert pixels to % IF they look like pixels
        const convertedData = importedData.map(mapItem => ({
          ...mapItem,
          rooms: mapItem.rooms.map(room => {
            // If the value is > 100, it's almost certainly a pixel value
            const isPixelX = room.x > 100;
            const isPixelY = room.y > 100;

            return {
              ...room,
              x: isPixelX ? (room.x / rect.width) * 100 : room.x,
              y: isPixelY ? (room.y / rect.height) * 100 : room.y
            };
          })
        }));

        setMaps(convertedData);
        alert("JSON Imported and Converted to Percentages!");
      } catch (err) {
        console.error(err);
        alert("Error parsing JSON.");
      }
    };
    reader.readAsText(file);
  };

  // --- UPDATED: SAVE WITH PERCENTAGES ---
  const saveRoom = () => {
    if (!roomForm.name || !imgRef.current) return;

    // We calculate % based on the image's "Rendered" size
    const rect = imgRef.current.getBoundingClientRect();
    const xPct = (tempCoords.x / rect.width) * 100;
    const yPct = (tempCoords.y / rect.height) * 100;

    let updatedRooms;
    if (editingRoomId) {
      updatedRooms = activeMap.rooms.map(r => 
        r.id === editingRoomId ? { ...r, ...roomForm } : r
      );
    } else {
      const newRoom = { 
        id: Date.now(), 
        ...roomForm, 
        x: xPct, // Saving as % now
        y: yPct  // Saving as % now
      };
      updatedRooms = [...activeMap.rooms, newRoom];
    }

    setMaps(maps.map(m => m.id === activeMapId ? { ...m, rooms: updatedRooms } : m));
    setIsModalOpen(false);
  };

  const handleImageClick = (e) => {
    setEditingRoomId(null);
    setRoomForm({ name: '', type: 'Classroom', status: 'vacant' });
    setTempCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setIsModalOpen(true);
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(maps, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "floor_plan_PERCENTAGE.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
      <div style={{ marginBottom: '20px', border: '2px dashed #ccc', padding: '10px' }}>
        <strong>Step 1: Import existing Pixel JSON: </strong>
        <input type="file" accept=".json" onChange={handleJsonImport} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          {maps.map(m => (
            <button key={m.id} onClick={() => setActiveMapId(m.id)} style={{ marginRight: '5px' }}>{m.name}</button>
          ))}
        </div>
        <button onClick={exportToJson} style={{ backgroundColor: '#28a745', color: 'white' }}>Download Percentage JSON</button>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img 
          ref={imgRef}
          src={activeMap.src} 
          onClick={handleImageClick}
          style={{ cursor: 'crosshair', display: 'block', maxWidth: '1000px' }}
        />

        {activeMap.rooms.map((room) => (
          <div 
            key={room.id} 
            style={{ 
              position: 'absolute', 
              left: `${room.x}%`, // Note the % here
              top: `${room.y}%`,  // Note the % here
              transform: 'translate(-50%, -50%)',
              zIndex: 10 
            }}
          >
             <div style={{ width: '14px', height: '14px', backgroundColor: room.status === 'occupied' ? 'red' : 'green', borderRadius: '50%', border: '2px solid white' }} />
             <span style={{ position: 'absolute', left: '10px', top: '-10px', fontSize: '11px', whiteSpace: 'nowrap', backgroundColor: 'white' }}>{room.name}</span>
          </div>
        ))}

        {isModalOpen && (
           <div style={{ position: 'absolute', top: tempCoords.y, left: tempCoords.x + 15, backgroundColor: 'white', padding: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 100 }}>
             <input value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} placeholder="Name" />
             <button onClick={saveRoom}>Save as Percentage</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default PercentageMapper;