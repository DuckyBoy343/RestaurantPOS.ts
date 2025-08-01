'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Item } from '../types/item';

interface Column {
    key: string;
    label: string;
}

interface MainGridProps {
    title: string;
    columns: Column[];
    items: Item[];
    itemNoun: string; // e.g., "Employee", "Usuario"
    onAddItem: (newItem: Omit<Item, 'id'>) => void;
    onEditItem: (item: Item) => void;
    onDeleteItems: (selectedIds: (string | number)[]) => void;
}

const renderCellContent = (value: unknown) => {
    if (typeof value === 'boolean') {
        return value ? (
            <span className="status-badge text-success">
                <i className="bi bi-check-circle-fill"></i> Activo
            </span>
        ) : (
            <span className="status-badge text-danger">
                <i className="bi bi-x-circle-fill"></i> Inactivo
            </span>
        );
    }
    return String(value ?? '');
};

export default function MainGrid({ title, columns, items, itemNoun }: MainGridProps) {
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allItemIds = items.map(item => item.id);
            setSelectedItems(allItemIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: string | number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const isAllSelected = items.length > 0 && selectedItems.length === items.length;

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-6">
                                <h2><b>{title}</b></h2>
                            </div>
                            <div className="col-sm-6">
                                <Button onClick={() => setShowAddModal(true)} className="btn btn-success">
                                    <i className="material-icons">&#xE147;</i> <span>Añadir {itemNoun}</span>
                                </Button>
                                <Button onClick={() => setShowDeleteModal(true)} className="btn btn-danger" disabled={selectedItems.length === 0}>
                                    <i className="material-icons">&#xE15C;</i> <span>Eliminar</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>
                                    <span className="custom-checkbox">
                                        <input type="checkbox" id="selectAll" checked={isAllSelected} onChange={handleSelectAll} aria-label="Select all rows" />
                                        <label htmlFor="selectAll"></label>
                                    </span>
                                </th>
                                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <span className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                id={`checkbox${item.id}`}
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                                aria-label={`Select row for item ${item.id}`}
                                            />
                                            <label htmlFor={`checkbox${item.id}`}></label>
                                        </span>
                                    </td>
                                    {columns.map(col => (
                                        <td key={`${item.id}-${col.key}`}>
                                            {/* Use the helper function to render the cell */}
                                            {renderCellContent(item[col.key])}
                                        </td>
                                    ))}
                                    <td>
                                        {/* Added action icons */}
                                        {/* onClick={() => onEditItem(item)} */}
                                        <a href="#edit" className="edit" >
                                            <i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
                                        </a>
                                        {/* onClick={() => onDeleteItems([item.id])} */}
                                        <a href="#delete" className="delete" >
                                            <i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="clearfix">
                        <div className="hint-text">Mostrando <b>{items.length}</b> de <b>{items.length}</b> registros</div>
                        <ul className="pagination">
                            <li className="page-item disabled"><a href="#">Anterior</a></li>
                            <li className="page-item active"><a href="#" className="page-link">1</a></li>
                            <li className="page-item"><a href="#" className="page-link">2</a></li>
                            <li className="page-item"><a href="#" className="page-link">3</a></li>
                            <li className="page-item"><a href="#" className="page-link">Siguiente</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add {itemNoun}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Add form...
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button variant="primary">Add</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {itemNoun}(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete these {selectedItems.length} records? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger">Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
