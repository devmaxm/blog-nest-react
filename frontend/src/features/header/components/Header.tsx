import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import { TRootState } from "../../../types/store/store";
import { useAppDispatch } from "../../../hooks/store";
import { logout } from "../../../store/slices/auth";

export function Header() {
  const { isAuth } = useSelector((state: TRootState) => state.auth);
  const dispatch = useAppDispatch()
  const handleLogout = () => dispatch(logout())

  return (
    <div className={styles.header_wrapper}>
      <div className="container">
        <div className={styles.header_container}>
          <ul className={styles.header_items}>
            <li className={styles.item}>
              <Link to="/">Home</Link>
            </li>
            {isAuth && (
              <li className={styles.item}>
                <Link to="/posts/add">Add Post</Link>
              </li>
            )}
          </ul>

          {isAuth && <div>
            <ul className={styles.header_items}>
              <li className={styles.item}>
                <p onClick={handleLogout} className='link'>Logout</p>
              </li>
            </ul>
            </div>}
          {!isAuth && (
            <div>
              <Link to="/auth/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
