import {useEffect, useState} from "react";
import {Card, Pagination} from "antd";

const ImageWall = ({ initialPhotos }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [photosPerPage, setPhotosPerPage] = useState(8);
    const [currentPhotos, setCurrentPhotos] = useState([]);

    useEffect(() => {
        const indexOfLastPhoto = currentPage * photosPerPage;
        const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
        const newPhotos = initialPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);
        setCurrentPhotos(newPhotos);
    }, [currentPage, initialPhotos, photosPerPage]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const gridView = (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {currentPhotos.map(photo => (
                <Card
                    key={photo.id}
                    hoverable
                    style={{ width: 240, margin: '10px' }}
                    cover={<img alt={photo.name} src={photo.url} />}
                >
                    <Card.Meta title={photo.name} description={`上传日期：${photo.date}`} />
                </Card>
            ))}
        </div>
    );

    return (
        <div>
            {gridView}
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={initialPhotos.length}
                pageSize={photosPerPage}
            />
        </div>
    );
};

export default ImageWall;