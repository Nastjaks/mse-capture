import React from 'react';
import '../theme/GalleryList.css';
import {Gallery} from '../models/Gallery';
import { Link } from 'react-router-dom';
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
                                <img src={gallery.preview_image} alt={gallery.title} className="gallery-image" />
                            ) : (
                                <img src="https://images.unsplash.com/photo-1638438134099-a91e5373aaf0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="placeholder" className="gallery-image" />
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
