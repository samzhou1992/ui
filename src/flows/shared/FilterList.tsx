import React, {FC, useState, useMemo} from 'react'

import {EmptyState, ComponentSize} from '@influxdata/clockface'
import SearchWidget from 'src/shared/components/search_widget/SearchWidget'

type Item = Record<string, any>

interface Props {
  placeholder: string
  emptyMessage: string
  extractor: (i: Item) => string
  items: Item[]
  renderItem: (i: Item) => JSX.Element
  listHeader?: () => JSX.Element
}

const FilterList: FC<Props> = ({
  extractor,
  items,
  placeholder,
  emptyMessage,
  renderItem,
  listHeader,
}) => {
  const [search, setSearch] = useState('')

  const list = useMemo(() => {
    const filtered = items.filter(i =>
      extractor(i)
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    if (!filtered.length) {
      return (
        <EmptyState size={ComponentSize.ExtraSmall}>
          <EmptyState.Text>{emptyMessage}</EmptyState.Text>
        </EmptyState>
      )
    } else {
      return (
        <>
          {filtered.map((item, idx) => (
            <div key={idx}>{renderItem(item)}</div>
          ))}
        </>
      )
    }
  }, [search, items])

  return useMemo(
    () => (
      <div className="flux-toolbar">
        <div className="flux-toolbar--search">
          <SearchWidget
            placeholderText={placeholder}
            onSearch={setSearch}
            searchTerm={search}
            testID="flux-toolbar-search--input"
          />
        </div>
        {!!listHeader && listHeader()}
        <div className="flux-toolbar--list" data-testid="flux-toolbar--list">
          {list}
        </div>
      </div>
    ),
    [list, setSearch]
  )
}

export default FilterList
