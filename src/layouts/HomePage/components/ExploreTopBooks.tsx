import { Link } from "react-router-dom";

export const ExploreTopBooks = () => {
    return (
        <div className='p-5 mb-4 bg-dark header' style={{ backgroundColor: '#6699cc' }}>


            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>Welcome to the world of books!</h1>
                    <p className='col-md-8 fs-4'>Where would you like to go next?</p>
                    <Link type='button' className='btn main-color btn-lg text-white' href='#' to='/search' style={{ backgroundColor: 'black' }}>
                        Explore top books</Link>
                </div>
            </div>
        </div>
    );
}