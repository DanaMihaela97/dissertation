import React from 'react';
import { AnimalProfile } from './entities/animalProfile';
import Link from 'next/link';
import { Cake, Cat, Dog, Syringe, Weight } from 'lucide-react';

const AnimalProfileComponent = ({ animal }: { animal: AnimalProfile }) => {
  const handleClick = () => {
    console.log('ID-ul animalului:', animal.id);
  };

  const animalIcon = animal.type === 'Câine' ? <Dog size={40} /> : <Cat size={40} />;

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '350px',
      backgroundColor: '#f9f9f9',
    }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
      }}>
        {animalIcon}
        <h3 style={{ marginLeft: '10px', marginBottom: '0' }}>{animal.animalName}</h3>
      </div>

      <p style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#777',
        margin: '5px 0',
      }}>
        {animal.breed}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px',
      }}>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Cake style={{ marginRight: '8px' }} />
          <p style={{ marginTop: '3px', marginBottom: '0' }}>
            {animal.age} ani
          </p>
        </div>


        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Weight style={{ marginRight: '8px' }} />
          <p style={{ marginTop: '3px', marginBottom: '0' }}>{animal.weight} kg</p>
        </div>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h4>Vaccinuri administrate:</h4>
        {animal.vaccines.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {animal.vaccines.map((vaccine) => (
              <li key={vaccine.vaccineId} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <Syringe style={{ marginRight: '8px' }} />
                {vaccine.vaccineName || 'Nume necunoscut'} - {new Date(vaccine.dateAdministered).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nu există vaccinuri înregistrate.</p>
        )}
      </div>

      {/* <Link href={`/animal-profile`} passHref>
        <button onClick={handleClick} style={{
          width: '100%',
          padding: '12px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          borderRadius: '5px',
          border: 'none',
          marginTop: '20px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Vezi toate detaliile
        </button>
      </Link> */}
    </div>
  );
};

export default AnimalProfileComponent;
