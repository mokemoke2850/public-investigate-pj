import { NavLink } from 'react-router-dom';

const HeaderDrawer = () => {
  const activeClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-sky-400' : '';
  return (
    <>
      <p>
        <NavLink className={activeClassName} to="/">
          React-Konva
        </NavLink>
      </p>
    </>
  );
};
export default HeaderDrawer;
