

# Source Reconstruction: UNanofabTools/app/models/chem_inventory.py

- Repository: `UNanofabTools`
- Relative path: `app/models/chem_inventory.py`
- Lines read: `167`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `00d777da8aa5361c`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `from datetime import datetime`, `from sqlalchemy import Sequence`, `from sqlalchemy import Column, Integer, BigInteger, String, Text, Date, DateTime, ForeignKey`, `from sqlalchemy.orm import declarative_base, relationship`, `from sqlalchemy.schema import UniqueConstraint, CheckConstraint`
- Classes: `Category`, `Vendor`, `Room`, `Item`, `Container`, `InventoryCycle`, `ScanRaw`, `ContainerScan`
- Functions: none detected
- Routes: none detected

## Sanitized Source Excerpt

```python
"""
Chemical Inventory Database Models
"""
from datetime import datetime
from sqlalchemy import Sequence
from sqlalchemy import Column, Integer, BigInteger, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.schema import UniqueConstraint, CheckConstraint

Base = declarative_base()

# Sequence for barcode generation
barcode_sequence = Sequence('seq_barcode', start=100001, increment=1)


class Category(Base):
    """Chemical categories"""
    __tablename__ = 'categories'
    __bind_key__ = 'chem_inventory'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False, unique=True)

    # Relationships
    items = relationship("Item", back_populates="category")


class Vendor(Base):
    """Chemical vendors"""
    __tablename__ = 'vendors'
    __bind_key__ = 'chem_inventory'

    vendor_id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_name = Column(Text, nullable=False, unique=True)

    # Relationships
    items = relationship("Item", back_populates="vendor")


class Room(Base):
    """Storage rooms/locations"""
    __tablename__ = 'rooms'
    __bind_key__ = 'chem_inventory'

    room_id = Column(Integer, primary_key=True, autoincrement=True)
    room_name = Column(Text, nullable=False, unique=True)
    building = Column(Text)
    lab_code = Column(Text)

    # Relationships
    containers = relationship("Container", back_populates="room")


class Item(Base):
    """Chemical items (material definitions)"""
    __tablename__ = 'items'
    __bind_key__ = 'chem_inventory'

    item_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False, unique=True)  # Added unique constraint
    description = Column(Text, nullable=False)
    catalog_number = Column(Text)
    physical_state = Column(Text)
    volume_size = Column(Text)
    category_id = Column(Integer, ForeignKey('categories.category_id', onupdate='CASCADE', ondelete='RESTRICT'), nullable=False)
    vendor_id = Column(Integer, ForeignKey('vendors.vendor_id', onupdate='CASCADE', ondelete='SET NULL'))

    # Relationships
    category = relationship("Category", back_populates="items")
    vendor = relationship("Vendor", back_populates="items")
    containers = relationship("Container", back_populates="item", cascade="all, delete-orphan")


class Container(Base):
    """Individual chemical containers (bottles)"""
    __tablename__ = 'containers'
    __bind_key__ = 'chem_inventory'

    container_id = Column(BigInteger, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey('items.item_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    barcode = Column(Text, nullable=False, unique=True)
    container_code = Column(Text, nullable=False, unique=True)
    room_id = Column(Integer, ForeignKey('rooms.room_id', onupdate='CASCADE', ondelete='SET NULL'))

    # Dates
    entry_date = Column(Date)
    manuf_date = Column(Date)
    expiry_date = Column(Date)

    # Location details
    area_class = Column(Text)
    storage_location = Column(Text)
    storage_sublocation = Column(Text)
    storage_device = Column(Text)

    # Additional fields
    system = Column(Text)
    lot_number = Column(Text)
    choice = Column(Text)
    nmr = Column(Text)
    nmr_expiry = Column(Date)
    owner = Column(Text)
    notes = Column(Text)
    status = Column(Text, nullable=False, default='Active')
    size = Column(Text)
    unit = Column(Text)

    # Legacy
    legacy_inventory_no = Column(Text)

    # Relationships
    item = relationship("Item", back_populates="containers")
    room = relationship("Room", back_populates="containers")
    scans = relationship("ContainerScan", back_populates="container", cascade="all, delete-orphan")


class InventoryCycle(Base):
    """Inventory scanning cycles"""
    __tablename__ = 'inventory_cycles'
    __bind_key__ = 'chem_inventory'

    cycle_id = Column(Integer, primary_key=True, autoincrement=True)
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    ended_at = Column(DateTime)
    created_by = Column(Text)

    # Relationships
    raw_scans = relationship("ScanRaw", back_populates="cycle", cascade="all, delete-orphan")
    container_scans = relationship("ContainerScan", back_populates="cycle", cascade="all, delete-orphan")


class ScanRaw(Base):
    """Raw barcode scans"""
    __tablename__ = 'scan_raw'
    __bind_key__ = 'chem_inventory'

    raw_id = Column(BigInteger, primary_key=True, autoincrement=True)
    cycle_id = Column(Integer, ForeignKey('inventory_cycles.cycle_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    raw_code = Column(Text, nullable=False)
    import_ts = Column(DateTime, nullable=False, default=datetime.utcnow)
    matched_container_id = Column(BigInteger, ForeignKey('containers.container_id', onupdate='CASCADE', ondelete='SET NULL'))

    # Relationships
    cycle = relationship("InventoryCycle", back_populates="raw_scans")


class ContainerScan(Base):
    """Matched container scans"""
    __tablename__ = 'container_scans'
    __bind_key__ = 'chem_inventory'

    scan_id = Column(BigInteger, primary_key=True, autoincrement=True)
    cycle_id = Column(Integer, ForeignKey('inventory_cycles.cycle_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    container_id = Column(BigInteger, ForeignKey('containers.container_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    scan_ts = Column(DateTime, nullable=False, default=datetime.utcnow)
    source = Column(Text)
    status = Column(Text, nullable=False)

    # Constraints
    __table_args__ = (
        UniqueConstraint('cycle_id', 'container_id', name='uq_cycle_container'),
        CheckConstraint("status IN ('FOUND','NEW')", name='ck_status'),
    )

    # Relationships
    cycle = relationship("InventoryCycle", back_populates="container_scans")
    container = relationship("Container", back_populates="scans")
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 1 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `none` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
Chemical Inventory Database Models
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 2 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 3 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
from datetime import datetime
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 4 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
from sqlalchemy import Sequence
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 5 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
from sqlalchemy import Column, Integer, BigInteger, String, Text, Date, DateTime, ForeignKey
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 6 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
from sqlalchemy.orm import declarative_base, relationship
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 7 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
from sqlalchemy.schema import UniqueConstraint, CheckConstraint
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 8 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
Base = declarative_base()
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 10 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 11 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
# Sequence for barcode generation
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
barcode_sequence = Sequence('seq_barcode', start=100001, increment=1)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 13 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 14 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 15 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
class Category(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 16 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    """Chemical categories"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 17 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
    __tablename__ = 'categories'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 18 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 19 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
    category_id = Column(Integer, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 21 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
    name = Column(Text, nullable=False, unique=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 22 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 23 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 24 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    items = relationship("Item", back_populates="category")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 25 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 26 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 27 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
class Vendor(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 28 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    """Chemical vendors"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 29 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    __tablename__ = 'vendors'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 30 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 31 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 32 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
    vendor_id = Column(Integer, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 33 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    vendor_name = Column(Text, nullable=False, unique=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 34 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 35 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 36 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
    items = relationship("Item", back_populates="vendor")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 37 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 38 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 39 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
class Room(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 40 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
    """Storage rooms/locations"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 41 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
    __tablename__ = 'rooms'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 42 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 43 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 44 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
    room_id = Column(Integer, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 45 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
    room_name = Column(Text, nullable=False, unique=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 46 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
    building = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 47 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
    lab_code = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 48 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 50 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
    containers = relationship("Container", back_populates="room")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 51 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 52 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 53 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
class Item(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 54 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    """Chemical items (material definitions)"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 55 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
    __tablename__ = 'items'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 56 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 57 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 58 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
    item_id = Column(Integer, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 59 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    name = Column(Text, nullable=False, unique=True)  # Added unique constraint
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 60 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
    description = Column(Text, nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 61 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
    catalog_number = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 62 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
    physical_state = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 63 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
    volume_size = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 64 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
    category_id = Column(Integer, ForeignKey('categories.category_id', onupdate='CASCADE', ondelete='RESTRICT'), nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 65 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
    vendor_id = Column(Integer, ForeignKey('vendors.vendor_id', onupdate='CASCADE', ondelete='SET NULL'))
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 66 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 67 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 68 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
    category = relationship("Category", back_populates="items")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 69 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
    vendor = relationship("Vendor", back_populates="items")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 70 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
    containers = relationship("Container", back_populates="item", cascade="all, delete-orphan")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 71 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 72 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 73 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
class Container(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 74 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
    """Individual chemical containers (bottles)"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 75 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
    __tablename__ = 'containers'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 76 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 77 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 78 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
    container_id = Column(BigInteger, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 79 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    item_id = Column(Integer, ForeignKey('items.item_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 80 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    barcode = Column(Text, nullable=False, unique=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 81 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    container_code = Column(Text, nullable=False, unique=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 82 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
    room_id = Column(Integer, ForeignKey('rooms.room_id', onupdate='CASCADE', ondelete='SET NULL'))
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 83 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 84 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
    # Dates
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 85 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
    entry_date = Column(Date)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 86 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
    manuf_date = Column(Date)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 87 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
    expiry_date = Column(Date)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 88 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 89 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
    # Location details
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 90 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
    area_class = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 91 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
    storage_location = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 92 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
    storage_sublocation = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 93 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
    storage_device = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 94 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 95 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
    # Additional fields
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 96 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
    system = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 97 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
    lot_number = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 98 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
    choice = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 99 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
    nmr = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 100 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
    nmr_expiry = Column(Date)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 101 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
    owner = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 102 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
    notes = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 103 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
    status = Column(Text, nullable=False, default='Active')
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 104 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
    size = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 105 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
    unit = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 106 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 107 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
    # Legacy
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 108 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
    legacy_inventory_no = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 109 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 110 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 111 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
    item = relationship("Item", back_populates="containers")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 112 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
    room = relationship("Room", back_populates="containers")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 113 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
    scans = relationship("ContainerScan", back_populates="container", cascade="all, delete-orphan")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 114 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 115 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 116 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
class InventoryCycle(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 117 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
    """Inventory scanning cycles"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 118 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
    __tablename__ = 'inventory_cycles'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 119 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 120 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 121 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
    cycle_id = Column(Integer, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 122 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 123 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
    ended_at = Column(DateTime)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 124 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
    created_by = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 125 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 126 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 127 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
    raw_scans = relationship("ScanRaw", back_populates="cycle", cascade="all, delete-orphan")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 128 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
    container_scans = relationship("ContainerScan", back_populates="cycle", cascade="all, delete-orphan")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 129 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 130 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 131 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
class ScanRaw(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 132 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
    """Raw barcode scans"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 133 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
    __tablename__ = 'scan_raw'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 134 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 135 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 136 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
    raw_id = Column(BigInteger, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 137 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
    cycle_id = Column(Integer, ForeignKey('inventory_cycles.cycle_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 138 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
    raw_code = Column(Text, nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 139 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
    import_ts = Column(DateTime, nullable=False, default=datetime.utcnow)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 140 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
    matched_container_id = Column(BigInteger, ForeignKey('containers.container_id', onupdate='CASCADE', ondelete='SET NULL'))
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 141 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 142 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 143 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
    cycle = relationship("InventoryCycle", back_populates="raw_scans")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 144 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 145 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 146 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
class ContainerScan(Base):
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 147 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
    """Matched container scans"""
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 148 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
    __tablename__ = 'container_scans'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 149 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
    __bind_key__ = 'chem_inventory'
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 150 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 151 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
    scan_id = Column(BigInteger, primary_key=True, autoincrement=True)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 152 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
    cycle_id = Column(Integer, ForeignKey('inventory_cycles.cycle_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 153 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
    container_id = Column(BigInteger, ForeignKey('containers.container_id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 154 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
    scan_ts = Column(DateTime, nullable=False, default=datetime.utcnow)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 155 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
    source = Column(Text)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 156 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
    status = Column(Text, nullable=False)
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 157 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 158 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
    # Constraints
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 159 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
    __table_args__ = (
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 160 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
        UniqueConstraint('cycle_id', 'container_id', name='uq_cycle_container'),
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 161 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
        CheckConstraint("status IN ('FOUND','NEW')", name='ck_status'),
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 162 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
    )
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 163 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 164 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
    # Relationships
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 165 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
    cycle = relationship("InventoryCycle", back_populates="container_scans")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 166 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
    container = relationship("Container", back_populates="scans")
```

Reconstruction rule: in `UNanofabTools/app/models/chem_inventory.py`, line 167 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/models/chem_inventory.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
