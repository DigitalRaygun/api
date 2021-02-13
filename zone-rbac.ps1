$assignee="18ea4ed8-a175-48bd-8ec6-92add0955f16"
$subscriptionId="8e07a292-1bcf-4514-b713-233600c87b2f"

az login
az account set -s $subscriptionId

$scope="/subscriptions/$subscriptionId/"

az role assignment create --assignee-object-id $assignee --role "DNS Zone Record Reader" --scope $scope

#foreach ($zone in $zones) {
    #$scope="/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Network/DnsZones/$zone/"

    #Write-Output $scope

    ##az role assignment create --assignee-object-id $assignee --role "DNS Zone Contributor" --scope $scope
#}