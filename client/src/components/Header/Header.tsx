import cardImage from '../../assets/cardImage.png';
import logoBGMOutline from '../../assets/logoBGMOutlineBW.png';

const Header = () => {
  return (
    <div className='header' style={{ backgroundImage: `url(${cardImage})` }}>
      <div className='header-logo' style={{ backgroundImage: `url(${logoBGMOutline})`}}></div>
    </div>
  );
};

export default Header;
