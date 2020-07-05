import React, { useState } from 'react'
import './css/Home.css'

import IRC from './IRC';

const Home = () => {
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false)

    const handleConnexion = () => {
        if (name !== '') {
            setOpen(true)
        }
    }

    if (open) {
        return (
            <IRC name={name} />
        )
    } else {
        return (
            <div className='container-fluid'>
                <div className='col-12' id='input-container'>
                    <div id='form'>
                        <h1><span id='title1'><b>Basic IRC</b></span></h1>
                        <h3><span id='title2'>Bienvenue</span></h3>
                        <label htmlFor='login'> </label>
                        <input type='text' className='form-control'
                            id='login'
                            placeholder='Nom'
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleConnexion()
                                }
                            }}
                            onChange={(e) => setName(e.target.value)} />
                        <input type='submit'
                            className='form-control btn btn-outline-light'
                            id='submit'
                            value='Connexion'
                            onClick={() => { handleConnexion() }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;