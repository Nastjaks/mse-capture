import React from 'react';
import '../theme/GalleryList.css';
import {Gallery} from '../models/Gallery';
import { Link } from 'react-router-dom';

interface GalleryListProps {
    galleries: Gallery[];
}

const GalleryListComponent: React.FC<GalleryListProps> = ({galleries}) => {
    return (
        <div className="gallery-container">
            {galleries.length > 0 ? (
                galleries.map((gallery) => (
                    <div key={gallery.id}>
                        <Link to={`/gallery/${gallery.id}`} className="gallery-link gallery-itme">
                        <h1 className="gallery-title">{gallery.title}</h1>
                        <p className="gallery-description">{gallery.description}</p>
                        {gallery.preview_image && (
                            <img src={gallery.preview_image} alt={gallery.title} className="gallery-image"/>
                        )}
                    </Link>
                    </div>
                ))
            ) : (
                <p>Keine Galerien gefunden.</p>
            )}
        </div>
    );
};

export default GalleryListComponent;
