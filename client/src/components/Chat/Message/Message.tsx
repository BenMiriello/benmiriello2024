import { IMessage, IUnsentMessage } from '@sharedTypes';
import robotAvatar from'../../../assets/robot.png';

const Message = ({ message }: { message: IMessage | IUnsentMessage }) => {
  const { id, text, role } = message;
  const handleClick = ('handleClick' in message) ? (message as IUnsentMessage).handleClick : undefined;

  return (
    <div id={id} className={`message ${role}`} onClick={handleClick}>
      { (role !== 'assistant' || id === 'assistant-reload-button') ? null :
        <img src={robotAvatar} alt='face of a friendly robot assistant' className='assistant-avatar' />
      }
      { text }
    </div>
  )
};

export default Message;
