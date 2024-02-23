import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';


type Resource = {
  id: string;
  title: string;
  userId: string;
};
const Dashboard: React.FC = () => {
  const [resource, setResource] = useState<Resource[]>([]);
  const navigate = useNavigate();
  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:5600/api/resources', {
        withCredentials: true,
      });
      setResource(response.data);
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };
  useEffect(() => {
    fetchResources();
  }, []);
  const renderObjects = () => {
    return resource.map((object) => <div><div className='h-10 bg-slate-500' key={object.id} onClick={()=> navigate(`/flashcards/${object.id}`)}>{object.title}
    
    </div> <button onClick={() => handleDelete(object.id)}>Delete</button> </div>);
  };
  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      await axios.post('http://localhost:5600/api/upload', formData, {
        withCredentials: true,
      });

      fetchResources();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleButton = async () => {
    const response = await axios.get('http://localhost:5600/auth/logout',{
      withCredentials: true,
    })
    if (response.status === 200 ) {
      navigate('/')
    }
  }
  const handleDelete = async (id: string) => {
      await axios.delete(`http://localhost:5600/api/resources/${id}`,{
      withCredentials: true,
    })
    fetchResources();
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });
  return (
    <div>
      <button onClick={handleButton}>Logout</button>
      <h1>Dashboard</h1>
      <div {...getRootProps()} className='h-32 bg-black'>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div>{renderObjects()}</div>
    </div>
  );
};

export default Dashboard;
