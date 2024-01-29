import PropTypes from 'prop-types';

const PrimaryButton = ({ title, customClass, type='button' }) => {
    return (
        <button type={type} className={`bg-primary hover:bg-black text-white font-bold transition-all py-4 px-8 md:px-12 rounded-full ${customClass}`}>
            <span className="button_text_white">{title}</span>

        </button>
    )
}

PrimaryButton.propTypes = {
    title: PropTypes.string.isRequired,
};

export default PrimaryButton