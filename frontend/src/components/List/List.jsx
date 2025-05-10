import './List.css'

export default function List({ submit, reset, title, children }) {
    return (
        <div id="List">
            <div className="title">{title}</div>
            {children}
        </div>
    )
}
