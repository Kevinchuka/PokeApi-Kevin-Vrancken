const Spinner = () => {
    return (
        <div className="spinner-wrap">
            <div className="spinner-orbit" />
            <div className="spinner-core" />
            <span className="visually-hidden">Loading...</span>
        </div>
    );
};

export default Spinner;
