import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './practise-bases.module.css'

const PracticeBases = () => {

  const [practiseBases, setPractiseBases] = useState([])

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <h1>Базы практик</h1>
        <button className="btn-primary">
          + Импорт базы практик
        </button>
      </div>

      <div className={styles.bottom}>
        <div className={styles.headerRow}>
          <p>Название базы практики</p>
        </div>

        {practiseBases && practiseBases.length > 0 ? (
          practiseBases.map((el: any) => (
            <Link to={`/practice-base/${el.id}`} key={el.id} className={styles.groupRow}>
              <p className={styles.practise__base}>{el?.groupNumber || el?.name}</p>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>Список базы практик пуст</div>
        )}
      </div>
    </div>
  )
}

export default PracticeBases
