import React from 'react';
import '../theme/GalleryList.css';
import {Gallery} from '../models/Gallery';
import {Link} from 'react-router-dom';
import {useAuth} from "../contexts/AuthContext";

interface GalleryListProps {
    galleries: Gallery[];
}

const GalleryListComponent: React.FC<GalleryListProps> = ({galleries}) => {
    const {currentUser} = useAuth();

    return (
        <div className="gallery-container">
            {galleries.length > 0 ? (
                galleries.map((gallery) => (
                    <div key={gallery.id}>
                        <Link to={`/gallery/${gallery.id}`} className="gallery-link gallery-itme">
                            {gallery.owner_id != currentUser.id && (
                                <p>By {gallery.profiles.display_name}</p>
                            )}
                            <h1 className="gallery-title">{gallery.title}</h1>
                            {gallery.preview_image ? (
                                <img src={gallery.preview_image} alt={gallery.title} className="gallery-image"/>
                            ) : (
                                <div className="gallery-image  placeholder-img"/>
                            )}
                        </Link>
                    </div>
                ))
            ) : (
                <div className="no-content">
                    <p>No Galleries.</p>
                </div>
            )}
        </div>
    );
};

export default GalleryListComponent;
