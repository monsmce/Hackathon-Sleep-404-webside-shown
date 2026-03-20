import React, { useState } from 'react';

const ScalableMapper = () => {
  // 1. Initial State with Multi-Floor Support
  const [maps, setMaps] = useState([
    { id: 1, name: 'Floor 3', src: '/floor3.jpg', rooms: [] },
    { id: 2, name: 'Floor 2', src: '/floor2.jpg', rooms: [] },
  ]);
  
  const [activeMapId, setActiveMapId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState({ x: 0, y: 0 });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', type: 'Classroom', status: 'vacant' });

  const roomTypes = ['Classroom', 'Group Room', 'Work Room', 'Lab', 'Office'];
  const activeMap = maps.find(m => m.id === activeMapId);

  // --- LOGIC HANDLERS ---

  const handleImageClick = (e) => {
    setEditingRoomId(null);
    setRoomForm({ name: '', type: 'Classroom', status: 'vacant' });
    setTempCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setIsModalOpen(true);
  };

  const handleDotClick = (e, room) => {
    e.stopPropagation(); 
    setEditingRoomId(room.id);
    setRoomForm({ name: room.name, type: room.type, status: room.status });
    setTempCoords({ x: room.x, y: room.y });
    setIsModalOpen(true);
  };

  const saveRoom = () => {
    if (!roomForm.name) return alert("Enter a name");

    let updatedRooms;
    if (editingRoomId) {
      updatedRooms = activeMap.rooms.map(r => 
        r.id === editingRoomId ? { ...r, ...roomForm } : r
      );
    } else {
      const newRoom = { id: Date.now(), ...roomForm, ...tempCoords };
      updatedRooms = [...activeMap.rooms, newRoom];
    }

    setMaps(maps.map(m => m.id === activeMapId ? { ...m, rooms: updatedRooms } : m));
    setIsModalOpen(false);
  };

  const deleteRoom = () => {
    const updatedRooms = activeMap.rooms.filter(r => r.id !== editingRoomId);
    setMaps(maps.map(m => m.id === activeMapId ? { ...m, rooms: updatedRooms } : m));
    setIsModalOpen(false);
  };

  // 2. Export Functionality
  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(maps, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "floor_plan_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* HEADER & CONTROLS */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Floor Mapper</h2>
          <div style={{ marginTop: '10px' }}>
            {maps.map(m => (
              <button 
                key={m.id} 
                onClick={() => { setActiveMapId(m.id); setIsModalOpen(false); }}
                style={{ 
                  marginRight: '8px', padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc',
                  backgroundColor: activeMapId === m.id ? '#007bff' : 'white',
                  color: activeMapId === m.id ? 'white' : 'black', cursor: 'pointer'
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={exportToJson} 
          style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Download JSON Export
        </button>
      </div>

      {/* MAP CONTAINER */}
      <div style={{ position: 'relative', display: 'inline-block', border: '2px solid #ddd', backgroundColor: 'white' }}>
        <img 
          src={activeMap.src} 
          onClick={handleImageClick}
          style={{ cursor: 'crosshair', display: 'block', maxWidth: '1000px' }}
        />

        {/* RENDER ROOMS */}
        {activeMap.rooms.map((room) => (
          <div 
            key={room.id} 
            onClick={(e) => handleDotClick(e, room)}
            style={{ position: 'absolute', left: `${room.x}px`, top: `${room.y}px`, cursor: 'pointer', zIndex: 10 }}
          >
             <div style={{
                width: '14px', height: '14px', backgroundColor: room.status === 'occupied' ? '#ff4d4d' : '#47d147',
                borderRadius: '50%', border: '2px solid white', transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 4px rgba(0,0,0,0.4)'
             }} />
             <span style={{
                position: 'absolute', left: '10px', top: '-10px', backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                boxShadow: '1px 1px 3px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', pointerEvents: 'none'
             }}>
               {room.name}
             </span>
          </div>
        ))}

        {/* MODAL (Add/Edit) */}
        {isModalOpen && (
           <div style={{ 
                position: 'absolute', top: tempCoords.y, left: tempCoords.x + 15, 
                backgroundColor: 'white', padding: '15px', borderRadius: '8px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 100, width: '180px'
            }}>
             <h4 style={{ margin: '0 0 10px 0' }}>{editingRoomId ? 'Edit' : 'New'} Room</h4>
             
             <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Name</label>
             <input value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} style={{ marginBottom: '10px', width: '90%' }} autoFocus />
             
             <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Type</label>
             <select value={roomForm.type} onChange={e => setRoomForm({...roomForm, type: e.target.value})} style={{ marginBottom: '10px', width: '100%' }}>
                {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
             </select>

             <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Status</label>
             <select value={roomForm.status} onChange={e => setRoomForm({...roomForm, status: e.target.value})} style={{ marginBottom: '15px', width: '100%' }}>
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
             </select>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button onClick={saveRoom} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>
                    {editingRoomId ? 'Save Changes' : 'Add Room'}
                </button>
                {editingRoomId && (
                    <button onClick={deleteRoom} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>
                        Delete
                    </button>
                )}
                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer', color: '#666' }}>Cancel</button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ScalableMapper;