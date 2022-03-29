import React from "react"
import { useAdminDeleteTaxRate } from "medusa-react"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { TaxRateType } from "../../../types/shared"

type TaxRate = {
  id: string
  name?: string
  rate: number | null
  code: string | null
  type: TaxRateType
}

export const TaxRateRow = ({ row, onEdit }) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const deleteTaxRate = useAdminDeleteTaxRate(row.original.id)

  const handleDelete = async (rate: TaxRate) => {
    if (!rate || rate.type !== TaxRateType.RATE) {
      return Promise.resolve()
    }

    const shouldDelete = await dialog({
      heading: "Delete tax rate",
      text: "Are you sure you want to delete this tax rate?",
    })

    if (!shouldDelete) {
      return
    }

    return deleteTaxRate
      .mutateAsync()
      .then(() => {
        notification("Success", "Tax rate was deleted.", "success")
      })
      .catch((err) => {
        notification("Error", getErrorMessage(err), "error")
      })
  }

  const actions = [
    {
      label: "Edit",
      onClick: () => onEdit(row.original),
      icon: <EditIcon size={20} />,
    },
  ]

  if (row.original.type === TaxRateType.RATE) {
    actions.push({
      label: "Delete Tax Rate",
      variant: "danger",
      onClick: () => handleDelete(row.original),
      icon: <TrashIcon size={20} />,
    })
  }

  return (
    <Table.Row
      color={"inherit"}
      forceDropdown
      actions={actions}
      {...row.getRowProps()}
      className="group"
    >
      {row.cells.map((cell, index) => {
        return cell.render("Cell", { index })
      })}
    </Table.Row>
  )
}