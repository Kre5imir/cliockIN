
import { useState, useEffect } from "react"
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import L from "leaflet";
import { Map, MapContainer, Marker, TileLayer } from "react-leaflet";
import osmProviders from "../leaflet/osm-providers"
import "leaflet/dist/leaflet.css";
import useGeoLocation from "../../hooks/useGeoLocation"
const EditNoteForm = ({ note, users }) => {

    const { isManager, isAdmin } = useAuth()

    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation()

    const [deleteNote, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [completed, setCompleted] = useState(note.completed)
    const [userId, setUserId] = useState(note.user)
   
    const LocationUpdated = useGeoLocation()
    const updatedLongitude = LocationUpdated.coordinates.lng
   
    const updatedLatitude = LocationUpdated.coordinates.lat
   
    
    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)


    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            await updateNote({ id: note.id, user: userId, title, text, completed, updatedLongitude, updatedLatitude })
        }
    }

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id })
    }
    
    const useClockOut = async (e) => {
        
        await updateNote({ id: note.id, user: userId, title, text, completed, updatedLongitude, updatedLatitude })
    }
    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteNoteClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }
    const markerIcon = new L.Icon({
        iconUrl: require("../leaflet/img/marker.png"),
        iconSize: [40, 40],
        iconAnchor: [17, 46], //[left/right, top/bottom]
        popupAnchor: [0, -46], //[left/right, top/bottom]
      });
    
    
//display content of the form and updated location on map at that moment note was saved 

/*  <h3>Updated Latitude {updatedLatitude}</h3>
    <h3>Updated Longitude {updatedLongitude}</h3>
    <h3>Latitude {note.latitude}</h3>
    <h3>Longitude {note.longitude}</h3>
    */
    const marker = {lat: note.latitude,lng:note.longitude}

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveNoteClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <label className="form__label" htmlFor="note-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="note-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="note-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="note-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="note-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="note-username">
                            ASSIGNED TO:</label>
                        <select
                            id="note-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                    <div className="row">
                    <div className="col text-center">
                    
                    <div className="col">
                        <MapContainer
                        center={marker}
                        zoom={12}
                        className="static-map"
                        >
                        <TileLayer url={osmProviders.maptiler.url} />
                        <Marker 
                        icon={markerIcon}
                        position= {[note.latitude, note.longitude]}>
                        </Marker>
                        </MapContainer>
                    </div>

                    <div className="row"><p>clock out location</p>
                    </div>
                        
                    <div className="col">
                        <MapContainer
                        center={marker}
                        zoom={12}
                        className="static-map"
                        >
                        <TileLayer url={osmProviders.maptiler.url} />
                        <Marker 
                        icon={markerIcon}
                        position= {[updatedLatitude, updatedLongitude]}>
                        </Marker>
                        </MapContainer>
                    </div>
                    </div>
                </div>
                </div>
                
            </form>

        </>
    )

    return content
}

export default EditNoteForm